document.addEventListener("DOMContentLoaded", () => {
    let produkList = [];
    let pelangganList = [];
    let transaksiList = [];
  
    // FORM SUBMISSIONS
    document.getElementById("form_produk").addEventListener("submit", simpanProduk);
    document.getElementById("form_pelanggan").addEventListener("submit", simpanPelanggan);
    document.getElementById("form_transaksi").addEventListener("submit", simpanTransaksi);
    document.getElementById("toggleMode").addEventListener("click", toggleMode);
  
    // (1) SIMPAN PRODUK
    function simpanProduk(e) {
      e.preventDefault();
      const nama = document.getElementById("nama_produk").value;
      const harga = parseFloat(document.getElementById("harga").value);
      const stok = parseInt(document.getElementById("stok").value);
  
      produkList.push({ nama, harga, stok });
      tampilkanProduk();
      e.target.reset();
    }
  
    function tampilkanProduk() {
      let table = document.getElementById("tabel_produk");
      table.innerHTML = `<tr class="bg-gray-200 dark:bg-gray-700">
        <th>Nama Produk</th>
        <th>Harga</th>
        <th>Stok</th>
      </tr>`;
      produkList.forEach(item => {
        table.innerHTML += `
          <tr>
            <td>${item.nama}</td>
            <td>${item.harga}</td>
            <td>${item.stok}</td>
          </tr>`;
      });
    }
  
    // (2) SIMPAN PELANGGAN
    function simpanPelanggan(e) {
      e.preventDefault();
      const nama = document.getElementById("nama_pelanggan").value;
      const alamat = document.getElementById("alamat").value;
      const telepon = document.getElementById("telepon").value;
  
      pelangganList.push({ nama, alamat, telepon });
      tampilkanPelanggan();
      e.target.reset();
    }
  
    function tampilkanPelanggan() {
      let table = document.getElementById("tabel_pelanggan");
      table.innerHTML = `<tr class="bg-gray-200 dark:bg-gray-700">
        <th>Nama</th>
        <th>Alamat</th>
        <th>Telepon</th>
      </tr>`;
      pelangganList.forEach(item => {
        table.innerHTML += `
          <tr>
            <td>${item.nama}</td>
            <td>${item.alamat}</td>
            <td>${item.telepon}</td>
          </tr>`;
      });
    }
  
    // (3) SIMPAN TRANSAKSI
    function simpanTransaksi(e) {
      e.preventDefault();
      const pelanggan = document.getElementById("transaksi_pelanggan").value;
      const produk = document.getElementById("transaksi_produk").value;
      const jumlah = parseInt(document.getElementById("jumlah").value);
  
      // Mencari produk di list
      const found = produkList.find(p => p.nama === produk);
      if (!found || found.stok < jumlah) {
        alert("Produk tidak ditemukan atau stok tidak cukup!");
        return;
      }
  
      found.stok -= jumlah; // kurangi stok
      let totalHarga = found.harga * jumlah;
  
      // Simpan transaksi
      transaksiList.push({
        pelanggan,
        produk,
        jumlah,
        totalHarga,
        tanggal: new Date() // catat waktu
      });
  
      tampilkanProduk(); // update stok di laporan stok
      tampilkanFaktur(); // update faktur
      updateRekap();     // update rekap
      e.target.reset();
    }
  
    // (4,5) Laporan stok & pelanggan -> sudah di-update di atas
  
    // (6) CARI PRODUK
    window.cariProduk = function() {
      let nama = document.getElementById("cari_produk").value.toLowerCase();
      let produk = produkList.find(p => p.nama.toLowerCase() === nama);
      document.getElementById("hasil_cari").innerText = produk
        ? `Produk: ${produk.nama}, Harga: ${produk.harga}, Stok: ${produk.stok}`
        : "Produk tidak ditemukan.";
    }
  
    // (7) FAKTUR JUAL
    function tampilkanFaktur() {
      let table = document.getElementById("tabel_faktur");
      table.innerHTML = `<tr class="bg-gray-200 dark:bg-gray-700">
        <th>Pelanggan</th>
        <th>Produk</th>
        <th>Jumlah</th>
        <th>Total Harga</th>
      </tr>`;
      transaksiList.forEach(item => {
        table.innerHTML += `
          <tr>
            <td>${item.pelanggan}</td>
            <td>${item.produk}</td>
            <td>${item.jumlah}</td>
            <td>${item.totalHarga}</td>
          </tr>`;
      });
    }
  
    // CETAK STRUK
    window.cetakStruk = function() {
      alert("Struk dicetak!"); 
      // Atau bisa pakai window.print() / buka jendela baru
    }
  
    // (8,9,10) REKAP PENJUALAN
    function updateRekap() {
      // 1) Harian
      let daily = {};
      // 2) Bulanan
      let monthly = {};
      // 3) Tahunan
      let yearly = {};
  
      // Grouping
      transaksiList.forEach(item => {
        let d = new Date(item.tanggal);
        let day = d.toLocaleDateString();  // ex: '24/03/2025'
        let month = `${d.getMonth()+1}-${d.getFullYear()}`; // ex: '3-2025'
        let year = d.getFullYear();       // ex: 2025
  
        if(!daily[day]) daily[day] = 0;
        daily[day] += item.totalHarga;
  
        if(!monthly[month]) monthly[month] = 0;
        monthly[month] += item.totalHarga;
  
        if(!yearly[year]) yearly[year] = 0;
        yearly[year] += item.totalHarga;
      });
  
      // Tampilkan ke table rekap harian
      let rekapHarian = document.getElementById("rekap_harian");
      rekapHarian.innerHTML = `<tr class="bg-gray-200 dark:bg-gray-700">
        <th>Tanggal</th><th>Total Penjualan</th></tr>`;
      for(let day in daily) {
        rekapHarian.innerHTML += `
          <tr>
            <td>${day}</td>
            <td>${daily[day]}</td>
          </tr>`;
      }
  
      // Tampilkan ke table rekap bulanan
      let rekapBulanan = document.getElementById("rekap_bulanan");
      rekapBulanan.innerHTML = `<tr class="bg-gray-200 dark:bg-gray-700">
        <th>Bulan-Tahun</th><th>Total Penjualan</th></tr>`;
      for(let month in monthly) {
        rekapBulanan.innerHTML += `
          <tr>
            <td>${month}</td>
            <td>${monthly[month]}</td>
          </tr>`;
      }
  
      // Tampilkan ke table rekap tahunan
      let rekapTahunan = document.getElementById("rekap_tahunan");
      rekapTahunan.innerHTML = `<tr class="bg-gray-200 dark:bg-gray-700">
        <th>Tahun</th><th>Total Penjualan</th></tr>`;
      for(let year in yearly) {
        rekapTahunan.innerHTML += `
          <tr>
            <td>${year}</td>
            <td>${yearly[year]}</td>
          </tr>`;
      }
    }
  
    // MODE MALAM
    function toggleMode() {
      document.body.classList.toggle("dark-mode");
    }
  });
  