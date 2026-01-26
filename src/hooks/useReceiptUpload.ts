import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_TIMEOUT = 30000; // 30 seconds for XHR upload
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

interface UseReceiptUploadReturn {
  uploadReceipt: (file: File) => Promise<string | null>;
  isUploading: boolean;
  uploadProgress: number;
  uploadedUrl: string | null;
  fileName: string | null;
  uploadError: string | null;
  resetUpload: () => void;
  retryUpload: () => void;
}

// Compress image for mobile optimization
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (file.type === "application/pdf") {
      resolve(file);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            reject(new Error("Compression failed"));
          }
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Image load failed"));
    };
    img.src = URL.createObjectURL(file);
  });
};

// XHR upload with real progress tracking
const uploadWithXHR = (
  signedUrl: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("timeout", () => {
      reject(new Error("Upload timeout"));
    });

    xhr.timeout = UPLOAD_TIMEOUT;
    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
};

export const useReceiptUpload = (): UseReceiptUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const lastFileRef = useRef<File | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const resetUpload = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
    }
    setUploadedUrl(null);
    setFileName(null);
    setUploadProgress(0);
    setUploadError(null);
    lastFileRef.current = null;
  }, []);

  const uploadReceipt = useCallback(async (file: File): Promise<string | null> => {
    lastFileRef.current = file;
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const errorMsg = "Please upload JPG, PNG, or PDF files only";
      setUploadError(errorMsg);
      toast({ title: "Invalid file type", description: errorMsg, variant: "destructive" });
      return null;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = "Maximum file size is 5MB";
      setUploadError(errorMsg);
      toast({ title: "File too large", description: errorMsg, variant: "destructive" });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(5);
    setUploadError(null);

    try {
      // Get current session for auth header
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Please log in to upload receipts");
      }

      setUploadProgress(10);

      // Compress image if needed (skip for PDFs)
      let fileToUpload = file;
      if (file.type.startsWith("image/") && file.size > 300000) {
        try {
          fileToUpload = await compressImage(file);
          setUploadProgress(15);
        } catch {
          fileToUpload = file;
        }
      }

      setUploadProgress(20);

      // Get signed upload URL from edge function
      const { data: signedData, error: signedError } = await supabase.functions.invoke(
        "create-signed-upload-url",
        {
          body: {
            fileName: file.name,
            contentType: fileToUpload.type,
          },
        }
      );

      if (signedError || !signedData?.signedUrl) {
        throw new Error(signedError?.message || "Failed to get upload URL");
      }

      setUploadProgress(25);

      // Upload using XHR with real progress tracking
      await uploadWithXHR(
        signedData.signedUrl,
        fileToUpload,
        (percent) => {
          // Map 0-100 to 25-95 range for overall progress
          const mappedProgress = 25 + Math.round(percent * 0.7);
          setUploadProgress(mappedProgress);
        }
      );

      setUploadProgress(100);
      setUploadedUrl(signedData.publicUrl);
      setFileName(file.name);

      toast({ title: "Receipt uploaded successfully", description: file.name });
      return signedData.publicUrl;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed. Please try again.";
      setUploadError(errorMsg);
      setUploadProgress(0);
      toast({ title: "Upload failed", description: errorMsg, variant: "destructive" });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const retryUpload = useCallback(() => {
    if (lastFileRef.current) {
      uploadReceipt(lastFileRef.current);
    }
  }, [uploadReceipt]);

  return {
    uploadReceipt,
    isUploading,
    uploadProgress,
    uploadedUrl,
    fileName,
    uploadError,
    resetUpload,
    retryUpload,
  };
};
