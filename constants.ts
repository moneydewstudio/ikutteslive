import { Question, User } from './types';

export const QUESTIONS_POOL: Question[] = [
  {
    id: 'q1',
    subject: 'TIU',
    difficulty: 3,
    text: 'Jika X = 1/16 dan Y = 16%, maka:',
    options: [
      { id: 'a', text: 'X > Y' },
      { id: 'b', text: 'X < Y' },
      { id: 'c', text: 'X = Y' },
      { id: 'd', text: 'X dan Y tidak bisa ditentukan' },
      { id: 'e', text: 'X = 2Y' }
    ],
    correct_option_id: 'b',
    explanation: 'X = 1/16 = 0.0625. Y = 16% = 0.16. Jadi X < Y.'
  },
  {
    id: 'q2',
    subject: 'TWK',
    difficulty: 2,
    text: 'Lambang negara Indonesia Garuda Pancasila diresmikan pemakaiannya pada tanggal:',
    options: [
      { id: 'a', text: '17 Agustus 1945' },
      { id: 'b', text: '18 Agustus 1945' },
      { id: 'c', text: '11 Februari 1950' },
      { id: 'd', text: '27 Desember 1949' },
      { id: 'e', text: '10 November 1945' }
    ],
    correct_option_id: 'c',
    explanation: 'Lambang Garuda Pancasila diresmikan pada Sidang Kabinet RIS tanggal 11 Februari 1950.'
  },
  {
    id: 'q3',
    subject: 'TKP',
    difficulty: 3,
    text: 'Atasan anda meminta mengerjakan tugas yang bukan job description anda, sikap anda:',
    options: [
      { id: 'a', text: 'Menolak dengan tegas' },
      { id: 'b', text: 'Menerima dan mengerjakan sebisanya' },
      { id: 'c', text: 'Menerima dengan syarat ada bonus' },
      { id: 'd', text: 'Mempelajari tugas tersebut lalu mengerjakan' },
      { id: 'e', text: 'Melaporkan ke HRD' }
    ],
    correct_option_id: 'd',
    explanation: 'Menunjukkan integritas dan semangat belajar tinggi adalah nilai plus dalam aspek profesionalisme.'
  },
  {
    id: 'q4',
    subject: 'TIU',
    difficulty: 4,
    text: 'Semua anggota asosiasi profesi harus hadir dalam rapat. Sebagian dokter adalah anggota asosiasi. Kesimpulannya:',
    options: [
      { id: 'a', text: 'Semua yang hadir adalah dokter' },
      { id: 'b', text: 'Sebagian peserta rapat adalah dokter' },
      { id: 'c', text: 'Semua dokter hadir dalam rapat' },
      { id: 'd', text: 'Semua yang hadir bukan dokter' },
      { id: 'e', text: 'Tidak ada kesimpulan yang benar' }
    ],
    correct_option_id: 'b',
    explanation: 'Silogisme: Sebagian dokter adalah anggota (hadir). Maka sebagian peserta rapat adalah dokter.'
  },
  {
    id: 'q5',
    subject: 'TWK',
    difficulty: 2,
    text: 'Amandemen UUD 1945 yang pertama dilakukan pada tahun:',
    options: [
      { id: 'a', text: '1998' },
      { id: 'b', text: '1999' },
      { id: 'c', text: '2000' },
      { id: 'd', text: '2001' },
      { id: 'e', text: '2002' }
    ],
    correct_option_id: 'b',
    explanation: 'Amandemen pertama UUD 1945 disahkan dalam Sidang Umum MPR pada tanggal 19 Oktober 1999.'
  },
  {
    id: 'q6',
    subject: 'TIU',
    difficulty: 3,
    text: 'Sinonim dari kata "Eklektik" adalah:',
    options: [
      { id: 'a', text: 'Memilih yang terbaik' },
      { id: 'b', text: 'Menolak pembaruan' },
      { id: 'c', text: 'Sangat kaku' },
      { id: 'd', text: 'Campuran tidak beraturan' },
      { id: 'e', text: 'Modern' }
    ],
    correct_option_id: 'a',
    explanation: 'Eklektik berarti bersifat memilih hal-hal yang terbaik dari berbagai sumber.'
  }
];

export const MOCK_USER: User = {
  id: 'u_123',
  name: 'Budi Santoso',
  email: 'budi@example.com',
  isPro: false,
  streak: 5
};