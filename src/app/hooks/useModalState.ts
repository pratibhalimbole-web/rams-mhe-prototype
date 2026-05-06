import { useSearchParams } from "react-router";

/**
 * Custom hook to manage modal state via URL query parameters
 * This prevents modals from closing when the Point and Edit tool causes re-renders
 * 
 * @param modalId - Unique identifier for the modal (e.g., "total-tests-defined")
 * @returns [isOpen, openModal, closeModal]
 */
export function useModalState(modalId: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isOpen = searchParams.get("modal") === modalId;
  
  const openModal = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("modal", modalId);
      return newParams;
    });
  };
  
  const closeModal = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("modal");
      return newParams;
    });
  };
  
  return [isOpen, openModal, closeModal] as const;
}
