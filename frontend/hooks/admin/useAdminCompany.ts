import { useCallback, useEffect, useState } from 'react';
import {
  CompanyPayload,
  CompanyProfile,
  createCompany,
  getCompanyProfile,
  updateCompany,
} from '@/services/api/company';

export function useAdminCompany() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCompanyProfile()
      .then((result) => setCompany(result))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(
    async (payload: CompanyPayload) => {
      setSaving(true);

      try {
        const result = company?.id
          ? await updateCompany(company.id, payload)
          : await createCompany(payload);

        setCompany(result);
        return result;
      } finally {
        setSaving(false);
      }
    },
    [company?.id],
  );

  return { company, loading, saving, save };
}
