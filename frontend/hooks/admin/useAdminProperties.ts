import { useCallback, useEffect, useState } from 'react';
import {
  addPropertyImage,
  createProperty,
  deleteProperty,
  deletePropertyImage,
  getProperties,
  PropertyAmenity,
  PropertyPayload,
  PropertyQuery,
  PropertyRecord,
  reorderPropertyImages,
  setPropertyFeaturedImage,
  updateProperty,
} from '@/services/api/properties';

type PropertyListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function useAdminProperties() {
  const [data, setData] = useState<PropertyRecord[]>([]);
  const [meta, setMeta] = useState<PropertyListMeta>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<PropertyQuery>({ page: 1, limit: 20 });

  const refresh = useCallback(
    async (nextFilters?: Partial<PropertyQuery>) => {
      const merged = {
        ...filters,
        ...(nextFilters || {}),
      };

      setFilters(merged);
      setLoading(true);

      try {
        const result = await getProperties(merged);
        setData(result?.data ?? []);
        setMeta(
          result?.meta ?? {
            total: 0,
            page: merged.page || 1,
            limit: merged.limit || 20,
            totalPages: 1,
          },
        );
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    refresh();
  }, []);

  const saveProperty = useCallback(
    async (payload: PropertyPayload, propertyId?: string) => {
      setSaving(true);

      try {
        if (propertyId) {
          await updateProperty(propertyId, payload);
        } else {
          await createProperty(payload);
        }

        await refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  const removeProperty = useCallback(
    async (propertyId: string) => {
      setSaving(true);

      try {
        await deleteProperty(propertyId);
        await refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  const addImage = useCallback(
    async (
      propertyId: string,
      payload: { imageUrl?: string; caption?: string; isFeatured?: boolean; file?: File },
    ) => {
      setSaving(true);

      try {
        const updated = await addPropertyImage(propertyId, payload);
        setData((previous) => previous.map((item) => (item.id === propertyId ? updated : item)));
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const removeImage = useCallback(async (propertyId: string, imageId: string) => {
    setSaving(true);

    try {
      const updated = await deletePropertyImage(propertyId, imageId);
      setData((previous) => previous.map((item) => (item.id === propertyId ? updated : item)));
    } finally {
      setSaving(false);
    }
  }, []);

  const reorderImages = useCallback(
    async (propertyId: string, items: Array<{ id: string; sortOrder: number }>) => {
      setSaving(true);

      try {
        const updated = await reorderPropertyImages(propertyId, items);
        setData((previous) => previous.map((item) => (item.id === propertyId ? updated : item)));
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const setFeaturedImage = useCallback(async (propertyId: string, imageId: string) => {
    setSaving(true);

    try {
      const updated = await setPropertyFeaturedImage(propertyId, imageId);
      setData((previous) => previous.map((item) => (item.id === propertyId ? updated : item)));
    } finally {
      setSaving(false);
    }
  }, []);

  const updateAmenities = useCallback(
    async (propertyId: string, amenities: PropertyAmenity[]) => {
      setSaving(true);

      try {
        await updateProperty(propertyId, { amenities });
        await refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  return {
    data,
    meta,
    loading,
    saving,
    filters,
    refresh,
    saveProperty,
    removeProperty,
    addImage,
    removeImage,
    reorderImages,
    setFeaturedImage,
    updateAmenities,
  };
}
