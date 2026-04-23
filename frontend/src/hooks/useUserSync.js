import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { syncUser } from "../lib/api";

// Best production approach would be Clerk webhooks,
// but this works fine for client-side syncing.
function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const hasSyncedRef = useRef(false);

  const { mutate: syncUserMutation, isSuccess } = useMutation({
    mutationFn: syncUser,
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasSyncedRef.current) return;

    const email = user.primaryEmailAddress?.emailAddress;
    const name = user.fullName || user.firstName || "User";
    const imageUrl = user.imageUrl;

    if (!email || !imageUrl) return;

    hasSyncedRef.current = true;

    syncUserMutation({
      email,
      name,
      imageUrl,
    });
  }, [isLoaded, isSignedIn, user, syncUserMutation]);

  return { isSynced: isSuccess };
}

export default useUserSync;