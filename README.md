# Web Pengumpulan dan Penilaian Babak 3 - PEDAS 2024  

Proyek ini bertujuan untuk membangun sebuah platform berbasis web untuk pengumpulan dan penilaian babak ketiga dalam kompetisi PEDAS 2024. Web ini dibangun menggunakan React untuk frontend dan Firebase untuk backend.  

## Fitur Utama  

1. **Autentikasi**  
   - Login peserta dan panitia menggunakan Firebase Authentication.  
   - Hak akses berbeda untuk peserta dan panitia.
   - Pembatasan akses berdasarkan waktu.
     
2. **Pengumpulan Berkas**  
   - Peserta dapat mengunggah berkas hasil kerja dalam format yang ditentukan.  
   - Validasi berkas sebelum pengunggahan.  

3. **Penilaian**  
   - Page untuk peserta memberikan penilaiannya kepada 5 tim lain.  
   - Sistem penilaian berbasis kriteria yang ditentukan.  

4. **Dashboard Panitia**  
   - Memantau peserta yang belum atau sudah mengumpulkan berkas dan melakukan penilaian.  
   - Mengubah data peserta, seperti nama, email, status pengumpulan, dan lainnya.  

## Teknologi yang Digunakan  

- **React**: Untuk membangun antarmuka pengguna (UI).  
- **Firebase**: Untuk backend, termasuk Authentication, Firestore (database), Storage, dan Hosting.  
- **Tailwind css**: Untuk membuat komponen UI yang baik.  
