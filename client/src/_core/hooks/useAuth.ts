import { useAuth as useAuthContext } from "@/_core/contexts/AuthContext";

export function useAuth() {
  return useAuthContext();
}
