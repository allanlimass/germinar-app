export const slugify = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const initials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const formatPhoneNumber = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "");
  const formattedValue = onlyNumbers.replace(
    /(\d{2})(\d{4,5})(\d{4})/, // 11 digits: (XX) XXXXX-XXXX
    "($1) $2-$3",
  );
  return formattedValue;
};

export const formatCpf = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "");
  const formattedValue = onlyNumbers.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/, // 11 digits: (XXX) XXX-XXXX
    "$1.$2.$3-$4",
  );
  return formattedValue;
};

export const formatCnpj = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "");
  const formattedValue = onlyNumbers.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, // 14 digits: (XX) XXXX-XXXX/XXXX-XX
    "$1.$2.$3/$4-$5",
  );
  return formattedValue;
};

export const formatZipCode = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "");
  const formattedValue = onlyNumbers.replace(
    /(\d{5})(\d{3})/, // 8 digits: XXXXX-XXX
    "$1-$2",
  );
  return formattedValue;
};
