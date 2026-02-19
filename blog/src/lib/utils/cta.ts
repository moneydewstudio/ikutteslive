// TEAM_010: CTA content helpers for blog funneling

export type CtaStyle = 'hard' | 'soft';

export type CtaConfig = {
  style: CtaStyle;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
};

const CTA_LINK = 'https://ikuttes.my.id/';

export const getCtaConfig = (style: CtaStyle): CtaConfig => {
  if (style === 'hard') {
    return {
      style,
      eyebrow: 'Latihan harian dimulai di sini',
      title: 'Mulai Daily Quiz CPNS sekarang',
      description:
        'Uji kemampuanmu dengan soal CPNS harian, langsung dari Ikuttes tanpa registrasi rumit.',
      buttonLabel: 'Mulai Daily Quiz',
      href: CTA_LINK,
    };
  }
  return {
    style,
    eyebrow: 'Butuh latihan yang terarah?',
    title: 'Kuatkan materi CPNS lewat Daily Quiz',
    description:
      'Bangun kebiasaan latihan singkat setiap hari supaya progres kamu konsisten.',
    buttonLabel: 'Lihat Daily Quiz',
    href: CTA_LINK,
  };
};
