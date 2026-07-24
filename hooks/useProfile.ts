import { fetchProfile } from "@/api/profile";
import { Profile } from "@/utils/types";
import { useEffect, useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      setProfile(await fetchProfile());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return { profile, loading, reload };
}
