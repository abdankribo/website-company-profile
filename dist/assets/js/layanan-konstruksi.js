/* Infografis layanan (halaman layanan.html).
   Data layanan ada di HEADING, SERVICES, dan DETAILS di bawah; kecepatan animasi di CONFIG.
   Koordinat pill pada kanvas desktop memakai piksel gambar asli 1920x1080. */

(function () {
  'use strict';

  // Konfigurasi
  var CONFIG = {
    rootSelector: '#lk-root',
    sectionSelector: '#layanan-konstruksi',
    frame: { w: 1920, h: 800, offsetY: 200 }, // area gambar yang dipakai (y 200–1000)
    desktopQuery: '(min-width: 1200px)',      // harus sama dengan breakpoint di CSS
    snakeDuration: 4200,                      // ms total ular menelusuri seluruh jalur
    gap: 10,                                  // celah putih antar segmen jalur
    autoplay: false,                          // true = sorot layanan bergantian otomatis (dimatikan agar infografis stabil)
    autoplayInterval: 3600,                   // ms
    minInkContrast: 2.6                       // di bawah ini teks otomatis jadi gelap
  };

  // Judul section
  var HEADING = {
    eyebrow: { id: 'SOLUSI KONSTRUKSI DECHO', en: 'DECHO CONSTRUCTION SOLUTIONS' },
    lines: [
      { id: 'Layanan', en: 'Our' },
      { id: 'Konstruksi Kami', en: 'Construction Services' }
    ],
    lead: {
      id: 'Beragam pilihan layanan konstruksi yang dirancang untuk memenuhi kebutuhan proyek Anda dengan mengutamakan kualitas, ketepatan, dan profesionalisme.',
      en: 'A range of construction services designed to meet your project needs, with a focus on quality, precision, and professionalism.'
    }
  };

  // Jalur (svg) — koordinat gambar asli, urutan dari kiri-bawah ke atas
  var TRACK = [
    { id: 'bar',     color: '#7f6af8', d: 'M0 968H798' },
    { id: 'purple',  color: '#7f6af8', d: 'M798 968A123 123 0 0 0 921 845' },
    { id: 'blue',    color: '#0a84ff', d: 'M921 845A129 133 0 0 1 1050 712' },
    { id: 'teal',    color: '#00c8aa', d: 'M1050 712A129 127 0 0 0 1179 585' },
    { id: 'emerald', color: '#00dc78', d: 'M1179 585A129 130 0 0 1 1308 455' },
    { id: 'green',   color: '#62e533', d: 'M1308 455A131 131 0 0 0 1439 324A92 92 0 0 0 1347 232H0', last: true }
  ];
  var TRACK_FULL = 'M0 968H798A123 123 0 0 0 921 845A129 133 0 0 1 1050 712A129 127 0 0 0 1179 585' +
                   'A129 130 0 0 1 1308 455A131 131 0 0 0 1439 324A92 92 0 0 0 1347 232H0';

  // Data layanan
  var SERVICES = [
    {
      id: 'bangunan',
      color: '#7f6af8',
      title: { id: 'Konstruksi Bangunan', en: 'Building Construction' },
      photo: { src: 'assets/images/layanan-konstruksi-bangunan.png', cx: 815, cy: 861, r: 82 },
      main:  { x: 480, y: 782, w: 400, h: 151 },
      dir: 'left',
      reveal: 'ltr',                        // sub-pill muncul urut dari kiri ke kanan (Bangunan Industri → Rumah Hunian → Gudang Baja)
      after: { seg: 'purple' },
      subRow: { y: 782, h: 88 },
      subs: [
        { label: { id: 'Bangunan Industri', en: 'Industrial Buildings' }, color: '#bba2f4', from: 8,   to: 300, vis: [8, 182] },
        { label: { id: 'Rumah Hunian',      en: 'Residential Houses' },   color: '#8a45f7', from: 182, to: 420, vis: [182, 314] },
        { label: { id: 'Gudang Baja',       en: 'Steel Warehouses' },     color: '#5b1fe0', from: 314, to: 560, vis: [314, 480] }
      ]
    },
    {
      id: 'sipil',
      color: '#0a84ff',
      title: { id: 'Pekerjaan Sipil', en: 'Civil Works' },
      photo: { src: 'assets/images/layanan-pekerjaan-sipil.png', cx: 1029, cy: 818, r: 82 },
      main:  { x: 950, y: 742, w: 405, h: 151 },
      dir: 'right',
      after: { seg: 'blue' },
      subRow: { y: 742, h: 88 },
      subs: [
        { label: { id: 'Konstruksi Sipil', en: 'Civil Construction' },  color: '#2b3df5', from: 1300, to: 1555, vis: [1355, 1555] },
        { label: { id: 'Struktur Beton',   en: 'Concrete Structures' }, color: '#4a80ff', from: 1440, to: 1725, vis: [1555, 1725] }
      ]
    },
    {
      id: 'baja',
      color: '#00c8aa',
      title: { id: 'Konstruksi Baja', en: 'Steel Construction' },
      photo: { src: 'assets/images/layanan-konstruksi-baja.png', cx: 1071, cy: 606, r: 82 },
      main:  { x: 720, y: 529, w: 380, h: 151 },
      dir: 'left',
      after: { seg: 'teal' },
      subRow: { y: 535, h: 88 },
      subs: [
        { label: { id: 'Catwalk dan Struktur Akses Baja', en: 'Catwalk & Steel Access Structures' }, color: '#3fdbe0', from: 60, to: 420, vis: [60, 304] },
        { label: { id: 'Bangunan Baja Industri', en: 'Industrial Steel Buildings' }, color: '#1ea6ad', from: 304, to: 600, vis: [304, 528] },
        { label: { id: 'Konstruksi Baja Sipil',  en: 'Civil Steel Construction' },   color: '#0090a6', from: 528, to: 790, vis: [528, 720] }
      ]
    },
    {
      id: 'movable',
      color: '#00dc78',
      title: { id: 'Movable Bridge & Sistem Hidrolik', en: 'Movable Bridge & Hydraulic System' },
      photo: { src: 'assets/images/layanan-movable-bridge.png', cx: 1286, cy: 562, r: 82 },
      main:  { x: 1210, y: 486, w: 345, h: 151 },
      dir: 'right',
      after: { seg: 'emerald' },
      subRow: { y: 486, h: 88 },
      subs: [
        { label: { id: 'Konstruksi MB', en: 'Movable Bridge Construction' }, color: '#10b981', from: 1510, to: 1725, vis: [1555, 1725] },
        { label: { id: 'Konstruksi Hidrolis',       en: 'Hydraulic Construction' },      color: '#3df2b0', from: 1700, to: 1905, vis: [1725, 1905] }
      ]
    },
    {
      id: 'pelabuhan',
      color: '#62e533',
      title: { id: 'Komponen Infrastruktur Pelabuhan', en: 'Port Infrastructure Components' },
      photo: { src: 'assets/images/layanan-komponen-pelabuhan.png', cx: 1331, cy: 347, r: 82 },
      main:  { x: 978, y: 271, w: 352, h: 151 },
      dir: 'left',
      after: { seg: 'green', frac: 0.1 },
      subRow: { y: 271, h: 88 },
      subs: [
        { label: { id: 'Dermaga Apung',  en: 'Floating Pier' },   color: '#9fe37e', from: 225, to: 520,  vis: [225, 412] },
        { label: { id: 'Fender',         en: 'Fender' },          color: '#77cc00', from: 412, to: 700,  vis: [412, 603] },
        { label: { id: 'Bollard / Cleat', en: 'Bollard / Cleat' }, color: '#4b9f26', from: 603, to: 880,  vis: [603, 803] },
        { label: { id: 'Frontal Frame',  en: 'Frontal Frame' },   color: '#2d6618', from: 803, to: 1040, vis: [803, 978] }
      ]
    }
  ];

  // Rincian sub-layanan (muncul di panel saat sub-pill diklik)
  var DETAILS = {
    'Gudang Baja': {
      img: 'assets/images/layanan-detail-gudang-baja.png',
      title: { id: 'Steel Warehouse Construction', en: 'Steel Warehouse Construction' },
      sub:   { id: 'Konstruksi gudang baja', en: 'Steel warehouse construction' },
      desc:  { id: 'Bangunan yang dirancang terutama untuk menyimpan barang, material, stok, atau peralatan.',
               en: 'Buildings designed primarily to store goods, materials, stock, or equipment.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Gudang baja WF dan H-Beam', en: 'WF and H-Beam steel warehouses' },
        { id: 'Gudang logistik', en: 'Logistics warehouses' },
        { id: 'Gudang penyimpanan material', en: 'Material storage warehouses' },
        { id: 'Gudang distribusi', en: 'Distribution warehouses' },
        { id: 'Gudang dengan atap bentang lebar', en: 'Warehouses with wide-span roofs' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'penyimpanan barang dan logistik.', en: 'storing goods and logistics.' } }
    },
    'Rumah Hunian': {
      img: 'assets/images/layanan-detail-rumah-hunian.png',
      title: { id: 'Residential Building Construction', en: 'Residential Building Construction' },
      sub:   { id: 'Konstruksi rumah hunian', en: 'Residential house construction' },
      desc:  { id: 'Bangunan yang diperuntukkan sebagai tempat tinggal individu atau keluarga.',
               en: 'Buildings intended as homes for individuals or families.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Rumah tinggal satu atau dua lantai', en: 'One- or two-storey houses' },
        { id: 'Rumah modern minimalis', en: 'Modern minimalist houses' },
        { id: 'Rumah dengan struktur baja', en: 'Houses with steel structures' },
        { id: 'Renovasi dan pengembangan rumah', en: 'Home renovation and extension' },
        { id: 'Pekerjaan struktur dan arsitektur rumah', en: 'Structural and architectural works for houses' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'kenyamanan, keamanan, dan kebutuhan penghuni.', en: 'comfort, safety, and the needs of the occupants.' } }
    },
    'Bangunan Industri': {
      img: 'assets/images/layanan-detail-bangunan-industri.png',
      title: { id: 'Industrial Building Construction', en: 'Industrial Building Construction' },
      sub:   { id: 'Konstruksi bangunan industri', en: 'Industrial building construction' },
      desc:  { id: 'Bangunan untuk kegiatan produksi, pengolahan, perakitan, atau operasional industri.',
               en: 'Buildings for production, processing, assembly, or industrial operations.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Pabrik dan bangunan produksi', en: 'Factories and production buildings' },
        { id: 'Workshop fabrikasi baja', en: 'Steel fabrication workshops' },
        { id: 'Hanggar', en: 'Hangars' },
        { id: 'Bangunan dengan overhead crane', en: 'Buildings with overhead cranes' },
        { id: 'Fasilitas perawatan mesin', en: 'Machine maintenance facilities' },
        { id: 'Bangunan pendukung operasional industri', en: 'Buildings supporting industrial operations' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'proses produksi dan kegiatan operasional industri.', en: 'production processes and industrial operations.' } }
    },
    'Konstruksi Baja Sipil': {
      img: 'assets/images/layanan-detail-konstruksi-baja-sipil.png',
      title: { id: 'Steel Structure – Civil Construction', en: 'Steel Structure – Civil Construction' },
      sub:   { id: 'Konstruksi baja sipil', en: 'Civil steel construction' },
      desc:  { id: 'Struktur baja untuk infrastruktur dan fasilitas sipil.',
               en: 'Steel structures for infrastructure and civil facilities.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Jembatan baja jalan raya', en: 'Steel highway bridges' },
        { id: 'Struktur baja fasilitas publik', en: 'Steel structures for public facilities' },
        { id: 'Kanopi dan struktur pelindung', en: 'Canopies and protective structures' },
        { id: 'Struktur penunjang infrastruktur', en: 'Infrastructure support structures' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'infrastruktur dan fasilitas sipil.', en: 'infrastructure and civil facilities.' } }
    },
    'Bangunan Baja Industri': {
      img: 'assets/images/layanan-detail-bangunan-baja-industri.png',
      title: { id: 'Industrial Steel Building', en: 'Industrial Steel Building' },
      sub:   { id: 'Bangunan baja industri', en: 'Industrial steel buildings' },
      desc:  { id: 'Bangunan yang digunakan untuk produksi, penyimpanan, perakitan, atau kegiatan operasional industri.',
               en: 'Buildings used for production, storage, assembly, or industrial operations.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Gudang baja WF/H-Beam', en: 'WF/H-Beam steel warehouses' },
        { id: 'Pabrik dan workshop', en: 'Factories and workshops' },
        { id: 'Hanggar', en: 'Hangars' },
        { id: 'Bangunan dengan overhead crane', en: 'Buildings with overhead cranes' },
        { id: 'Bangunan produksi', en: 'Production buildings' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'bangunan untuk kegiatan industri.', en: 'buildings for industrial activities.' } }
    },
    'Catwalk dan Struktur Akses Baja': {
      img: 'assets/images/layanan-detail-catwalk-akses-baja.png',
      title: { id: 'Steel Catwalk & Access Structure', en: 'Steel Catwalk & Access Structure' },
      sub:   { id: 'Catwalk dan struktur akses baja', en: 'Steel catwalks and access structures' },
      desc:  { id: 'Struktur berupa jalur berjalan atau platform untuk akses, inspeksi, pemeliharaan, dan operasional peralatan.',
               en: 'Walkways or platforms for access, inspection, maintenance, and equipment operation.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Catwalk di dermaga', en: 'Catwalks on piers' },
        { id: 'Jalur akses antarstruktur', en: 'Access routes between structures' },
        { id: 'Platform inspeksi', en: 'Inspection platforms' },
        { id: 'Walkway baja dengan grating', en: 'Steel walkways with grating' },
        { id: 'Tangga dan railing baja', en: 'Steel stairs and railings' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'akses dan mobilitas personel pada fasilitas.', en: 'access and personnel mobility within facilities.' } }
    },
    'Konstruksi Sipil': {
      img: 'assets/images/layanan-detail-konstruksi-sipil.png',
      title: { id: 'Civil Construction', en: 'Civil Construction' },
      sub:   { id: 'Konstruksi sipil', en: 'Civil construction' },
      desc:  { id: 'Mencakup pekerjaan pembangunan infrastruktur dan pekerjaan sipil secara umum, menggunakan material beton, baja, pasangan batu, tanah, maupun kombinasi.',
               en: 'Covers infrastructure development and civil works in general, using concrete, steel, masonry, earth, or a combination of materials.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Pembangunan jalan dan perkerasan', en: 'Road and pavement construction' },
        { id: 'Pekerjaan drainase dan saluran', en: 'Drainage and channel works' },
        { id: 'Pekerjaan tanah dan timbunan', en: 'Earthworks and embankments' },
        { id: 'Dinding penahan tanah', en: 'Retaining walls' },
        { id: 'Fondasi dan pekerjaan dermaga', en: 'Foundations and pier works' },
        { id: 'Pekerjaan struktur beton maupun baja', en: 'Concrete and steel structure works' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'pembangunan infrastruktur dan pekerjaan sipil secara keseluruhan.', en: 'overall infrastructure development and civil works.' } }
    },
    'Struktur Beton': {
      img: 'assets/images/layanan-detail-struktur-beton.png',
      title: { id: 'Concrete Structure Works', en: 'Concrete Structure Works' },
      sub:   { id: 'Pekerjaan struktur beton', en: 'Concrete structure works' },
      desc:  { id: 'Berfokus pada elemen struktur yang dibuat dari beton, umumnya beton bertulang, untuk menopang beban bangunan atau infrastruktur.',
               en: 'Focused on structural elements made of concrete, typically reinforced concrete, to carry the loads of buildings or infrastructure.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Fondasi beton bertulang', en: 'Reinforced concrete foundations' },
        { id: 'Kolom dan balok beton', en: 'Concrete columns and beams' },
        { id: 'Pelat lantai dan pelat jembatan', en: 'Floor slabs and bridge decks' },
        { id: 'Pile cap dan pile head', en: 'Pile caps and pile heads' },
        { id: 'Abutment dan pier jembatan', en: 'Bridge abutments and piers' },
        { id: 'Dinding beton struktural', en: 'Structural concrete walls' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'elemen struktur beton yang menahan dan menyalurkan beban.', en: 'concrete structural elements that carry and transfer loads.' } }
    },
    'Konstruksi MB': {
      img: 'assets/images/layanan-detail-konstruksi-mb.png',
      title: { id: 'Movable Bridge (MB) Construction', en: 'Movable Bridge (MB) Construction' },
      sub:   { id: 'Konstruksi jembatan bergerak', en: 'Movable bridge construction' },
      desc:  { id: 'Berfokus pada struktur fisik jembatan dan komponen mekanis yang memungkinkan jembatan bergerak.',
               en: 'Focused on the physical bridge structure and the mechanical components that allow the bridge to move.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Fabrikasi struktur baja MB', en: 'MB steel structure fabrication' },
        { id: 'Main girder dan cross beam', en: 'Main girders and cross beams' },
        { id: 'Deck atau lantai jembatan', en: 'Bridge deck or flooring' },
        { id: 'Pin, hinge, dan mekanisme pivot', en: 'Pins, hinges, and pivot mechanisms' },
        { id: 'Struktur penyangga dan sambungan', en: 'Support structures and connections' },
        { id: 'Instalasi serta perakitan jembatan', en: 'Bridge installation and assembly' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'struktur jembatan dan mekanisme geraknya.', en: 'the bridge structure and its movement mechanism.' } }
    },
    'Konstruksi Hidrolis': {
      img: 'assets/images/layanan-detail-sistem-hidrolis.png',
      title: { id: 'Hydraulic Systems', en: 'Hydraulic Systems' },
      sub:   { id: 'Sistem hidrolis', en: 'Hydraulic systems' },
      desc:  { id: 'Berfokus pada sistem tenaga fluida yang menghasilkan dan mengendalikan gerakan mekanis.',
               en: 'Focused on fluid power systems that generate and control mechanical movement.' },
      list: { label: { id: 'Contoh pekerjaan', en: 'Example works' }, items: [
        { id: 'Hydraulic power unit (HPU)', en: 'Hydraulic power unit (HPU)' },
        { id: 'Silinder hidrolik', en: 'Hydraulic cylinders' },
        { id: 'Pompa dan motor hidrolik', en: 'Hydraulic pumps and motors' },
        { id: 'Control valve dan directional valve', en: 'Control valves and directional valves' },
        { id: 'Pipa, selang, dan fitting hidrolik', en: 'Hydraulic pipes, hoses, and fittings' },
        { id: 'Sistem kontrol, pengujian, dan commissioning', en: 'Control systems, testing, and commissioning' }
      ] },
      focus: { label: { id: 'Fokus', en: 'Focus' }, text: { id: 'tenaga penggerak, kontrol, dan pengoperasian.', en: 'drive power, control, and operation.' } }
    },
    'Frontal Frame': {
      img: 'assets/images/layanan-detail-frontal-frame.png',
      title: { id: 'Frontal Frame', en: 'Frontal Frame' },
      sub:   { id: 'Struktur rangka depan dermaga', en: 'Pier front frame structure' },
      desc:  { id: 'Struktur pendukung yang dipasang di bagian depan dermaga untuk menopang atau menghubungkan sistem fender dan mendistribusikan beban benturan kapal ke struktur pendukungnya, sesuai desain.',
               en: 'A supporting structure installed at the front of the pier to hold or connect the fender system and distribute vessel impact loads to its supporting structure, as designed.' },
      list: { label: { id: 'Contoh komponen', en: 'Example components' }, items: [
        { id: 'Rangka baja atau beton', en: 'Steel or concrete frames' },
        { id: 'Balok penghubung', en: 'Connecting beams' },
        { id: 'Pelat dudukan fender', en: 'Fender mounting plates' },
        { id: 'Sambungan dan elemen penyalur beban', en: 'Connections and load-transfer elements' }
      ] },
      focus: { label: { id: 'Fungsi utama', en: 'Main function' }, text: { id: 'mendukung sistem perlindungan benturan kapal.', en: 'supporting the vessel impact protection system.' } }
    },
    'Bollard / Cleat': {
      img: 'assets/images/layanan-detail-bollard-cleat.png',
      title: { id: 'Bollard / Cleat', en: 'Bollard / Cleat' },
      sub:   { id: 'Peralatan pengikat kapal', en: 'Vessel mooring equipment' },
      desc:  { id: 'Perangkat untuk mengikat tali tambat kapal agar kapal tetap berada pada posisi yang direncanakan.',
               en: 'Devices for securing vessel mooring lines so the vessel stays in its planned position.' },
      list: { label: null, items: [
        [{ id: 'Bollard', en: 'Bollard' }, { id: 'umumnya berukuran lebih besar dan digunakan di dermaga untuk menahan beban tambat sesuai kapasitas desain.',
                                              en: 'generally larger and used on piers to resist mooring loads according to the design capacity.' }],
        [{ id: 'Cleat', en: 'Cleat' }, { id: 'umumnya lebih kecil, digunakan untuk mengikat tali pada kapal, ponton, atau fasilitas tambat tertentu.',
                                          en: 'generally smaller, used to secure lines on vessels, pontoons, or specific mooring facilities.' }]
      ] },
      focus: { label: { id: 'Fungsi utama', en: 'Main function' }, text: { id: 'menahan gaya tambat kapal, bukan menyerap benturan kapal seperti fender.', en: 'resisting vessel mooring forces, not absorbing vessel impact like a fender.' } }
    },
    'Fender': {
      img: 'assets/images/layanan-detail-fender.png',
      title: { id: 'Fender', en: 'Fender' },
      sub:   { id: 'Sistem pelindung benturan kapal', en: 'Vessel impact protection system' },
      desc:  { id: 'Perangkat yang menyerap energi ketika kapal bersandar agar gaya benturan yang diteruskan ke dermaga dan kapal dapat dikendalikan.',
               en: 'Devices that absorb energy when a vessel berths so that the impact force transmitted to the pier and the vessel is kept under control.' },
      list: { label: { id: 'Contoh', en: 'Examples' }, items: [
        { id: 'Rubber cone fender', en: 'Rubber cone fenders' },
        { id: 'Cell fender', en: 'Cell fenders' },
        { id: 'Arch fender', en: 'Arch fenders' },
        { id: 'Cylindrical fender', en: 'Cylindrical fenders' },
        { id: 'Fender panel dengan UHMW-PE facing pad', en: 'Fender panels with UHMW-PE facing pads' }
      ] },
      focus: { label: { id: 'Fungsi utama', en: 'Main function' }, text: { id: 'menyerap energi benturan dan mengurangi risiko kerusakan kapal maupun dermaga.', en: 'absorbing impact energy and reducing the risk of damage to vessels and piers.' } }
    },
    'Dermaga Apung': {
      img: 'assets/images/layanan-detail-dermaga-apung.png',
      title: { id: 'Floating Dock / Dermaga Apung', en: 'Floating Dock / Floating Pier' },
      sub:   { id: 'Dermaga dengan struktur terapung', en: 'Pier with a floating structure' },
      desc:  { id: 'Fasilitas sandar yang mengapung di permukaan air dan mengikuti perubahan muka air.',
               en: 'Berthing facilities that float on the water surface and follow changes in water level.' },
      list: { label: { id: 'Contoh', en: 'Examples' }, items: [
        { id: 'Ponton baja', en: 'Steel pontoons' },
        { id: 'Ponton beton', en: 'Concrete pontoons' },
        { id: 'Ponton HDPE modular', en: 'Modular HDPE pontoons' },
        { id: 'Floating walkway', en: 'Floating walkways' },
        { id: 'Sistem tambat dan pengarah ponton', en: 'Pontoon mooring and guide systems' }
      ] },
      focus: { label: { id: 'Fungsi utama', en: 'Main function' }, text: { id: 'menyediakan tempat sandar atau akses dari darat ke kapal dengan struktur yang mengikuti permukaan air.', en: 'providing a berthing place or access from land to vessels with a structure that follows the water surface.' } }
    }
  };

  // Mesin render
  var W = CONFIG.frame.w, H = CONFIG.frame.h, OY = CONFIG.frame.offsetY;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqDesktop = window.matchMedia ? window.matchMedia(CONFIG.desktopQuery) : { matches: true };
  var lang = detectLang();

  function px(x)  { return round(x / W * 100); }          // x gambar -> % lebar kanvas
  function py(y)  { return round((y - OY) / H * 100); }    // y gambar -> % tinggi kanvas
  function pw(v)  { return round(v / W * 100); }
  function ph(v)  { return round(v / H * 100); }
  function round(v) { return Math.round(v * 1000) / 1000; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function i18n(node, obj) {
    node.setAttribute('data-id', obj.id);
    node.setAttribute('data-en', obj.en);
    node.textContent = obj[lang] || obj.id;
    return node;
  }
  function setVars(node, vars) {
    Object.keys(vars).forEach(function (k) { node.style.setProperty('--' + k, vars[k]); });
  }

  /* warna teks otomatis: putih bila kontras cukup, selain itu biru-tua gelap */
  function luminance(hex) {
    var h = hex.replace('#', '');
    var c = [0, 2, 4].map(function (i) {
      var v = parseInt(h.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function inkFor(hex) {
    return 1.05 / (luminance(hex) + 0.05) >= CONFIG.minInkContrast ? '#ffffff' : '#0b1b2e';
  }

  function detectLang() {
    var l = (document.documentElement.getAttribute('lang') || 'id').toLowerCase();
    if (l.indexOf('en') === 0) return 'en';
    try {
      var s = localStorage.getItem('lang') || localStorage.getItem('language') || localStorage.getItem('decho-lang');
      if (s && s.toLowerCase().indexOf('en') === 0) return 'en';
    } catch (e) { /* abaikan */ }
    return 'id';
  }

  // judul
  function renderHeading(section) {
    var eyebrow = section.querySelector('.lk-eyebrow');
    var title = section.querySelector('.lk-title');
    var lead = section.querySelector('.lk-lead');
    if (eyebrow) i18n(eyebrow, HEADING.eyebrow);
    if (title) {
      title.textContent = '';
      HEADING.lines.forEach(function (ln) {
        var wrap = el('span', 'lk-line');
        wrap.appendChild(i18n(document.createElement('span'), ln));
        title.appendChild(wrap);
      });
    }
    if (lead) i18n(lead, HEADING.lead);
  }

  // jalur
  function renderTrack(stage) {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'lk-track');
    svg.setAttribute('viewBox', '0 ' + OY + ' ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    var defs = document.createElementNS(SVGNS, 'defs');
    var full = document.createElementNS(SVGNS, 'path');
    full.setAttribute('id', 'lk-fullpath');
    full.setAttribute('d', TRACK_FULL);
    defs.appendChild(full);
    svg.appendChild(defs);

    var segs = TRACK.map(function (t) {
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('class', 'lk-seg');
      p.setAttribute('d', t.d);
      p.setAttribute('stroke', t.color);
      svg.appendChild(p);
      return { id: t.id, path: p, gap: t.last ? 0 : CONFIG.gap };
    });

    /* kepala ular: memimpin di ujung jalur yang sedang tergambar */
    var head = document.createElementNS(SVGNS, 'g');
    head.setAttribute('class', 'lk-head');
    var hb = document.createElementNS(SVGNS, 'circle');
    hb.setAttribute('r', '24.5');
    var hc = document.createElementNS(SVGNS, 'circle');
    hc.setAttribute('r', '9');
    hc.setAttribute('class', 'lk-head-core');
    head.appendChild(hb); head.appendChild(hc);
    svg.appendChild(head);

    stage.appendChild(svg);
    return { svg: svg, segs: segs, head: head, headBody: hb };
  }

  /* menghitung panjang tiap segmen & jarak kumulatif; kondisi awal = belum tergambar */
  function prepareTrack(track) {
    var L = 0;
    track.segs.forEach(function (s) {
      var len = s.path.getTotalLength();
      s.len = len;
      s.dist = L;                                   // jarak awal segmen sepanjang jalur
      s.visible = Math.max(len - s.gap, 1);         // bagian yang digambar (sisanya = celah putih)
      s.path.style.strokeDasharray = s.visible + ' ' + (len + 20);
      s.path.style.strokeDashoffset = s.visible;
      L += len;
    });
    track.L = L;
  }

  function segById(track, id) {
    for (var i = 0; i < track.segs.length; i++) if (track.segs[i].id === id) return track.segs[i];
    return track.segs[0];
  }

  // grup layanan
  function renderGroup(svc, n, track) {
    var seg = segById(track, svc.after.seg);
    var frac = svc.after.frac == null ? 1 : svc.after.frac;

    var g = el('article', 'lk-group');
    g.setAttribute('role', 'group');
    g.setAttribute('aria-label', svc.title[lang] || svc.title.id);
    g.setAttribute('data-dir', svc.dir);
    g.setAttribute('data-id', svc.id);
    setVars(g, { c: svc.color, n: n, d: '0s', ink: inkFor(svc.color) });
    g._at = seg.dist + seg.len * frac;   // kepala ular melewati titik ini -> grup muncul
    g._on = false;

    /* — sub pill — */
    var ul = el('ul', 'lk-subs');
    ul.id = 'lk-subs-' + svc.id;
    var count = svc.subs.length;
    svc.subs.forEach(function (s, idx) {
      var li = el('li', 'lk-sub');
      var fromMain = svc.dir === 'left' ? count - 1 - idx : idx;      // 0 = paling dekat pill utama
      var z = svc.dir === 'left' ? idx : count - idx;                  // dekat pill utama = di atas
      var padL = (s.vis[0] - s.from) + 10;
      var padR = (s.to - s.vis[1]) + 10;
      setVars(li, {
        x: px(s.from), y: py(svc.subRow.y), w: pw(s.to - s.from), h: ph(svc.subRow.h),
        pl: round(padL / W * 100), pr: round(padR / W * 100),
        sc: s.color, ink: s.ink || inkFor(s.color), i: fromMain, z: z,
        o: svc.reveal === 'ltr' ? idx : fromMain          // urutan kemunculan (default: dari yang terdekat pill utama)
      });
      var txt = i18n(el('span', 'lk-txt'), s.label);
      li.appendChild(txt);
      if (DETAILS[s.label.id]) {                 // sub-layanan yang punya rincian -> bisa diklik
        li.classList.add('lk-sub--link');
        li.setAttribute('data-detail', s.label.id);
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '-1');         // baru bisa difokus setelah grupnya dibuka
        li.setAttribute('aria-expanded', 'false');
        li.setAttribute('aria-controls', 'lk-detail');
      }
      ul.appendChild(li);
    });
    g.appendChild(ul);

    /* — pill utama — */
    var m = svc.main, ph0 = svc.photo;
    var photoLeft = ph0.cx - ph0.r, photoRight = ph0.cx + ph0.r;
    var circleOnRight = ph0.cx > m.x + m.w / 2;
    var padLm = circleOnRight ? 22 : Math.max(22, photoRight - m.x + 6);
    var padRm = circleOnRight ? Math.max(22, m.x + m.w - photoLeft + 6) : 22;
    var main = el('h3', 'lk-main');
    setVars(main, {
      x: px(m.x), y: py(m.y), w: pw(m.w), h: ph(m.h),
      pl: round(padLm / W * 100), pr: round(padRm / W * 100)
    });
    var btn = el('button', 'lk-main__btn');       // pill utama = tombol buka/tutup sub-layanan
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', ul.id);
    btn.appendChild(i18n(el('span', 'lk-txt'), svc.title));
    main.appendChild(btn);
    g.appendChild(main);

    /* — foto bulat — */
    var photo = el('div', 'lk-photo');
    setVars(photo, { x: px(ph0.cx - ph0.r), y: py(ph0.cy - ph0.r), w: pw(ph0.r * 2) });
    var img = document.createElement('img');
    img.src = ph0.src;
    img.alt = '';
    img.width = 336; img.height = 336;
    img.loading = 'lazy';
    img.decoding = 'async';
    photo.appendChild(img);
    g.appendChild(photo);

    return g;
  }

  // panel rincian (inline, membuka di bawah infografis)
  function buildDetail(root) {
    var box = el('div', 'lk-detail');
    box.id = 'lk-detail';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML =
      '<div class="lk-detail__clip"><div class="lk-detail__panel">' +
        '<button type="button" class="lk-detail__close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="lk-detail__media"><img alt="" width="350" height="262" decoding="async"></div>' +
        '<div class="lk-detail__body">' +
          '<span class="lk-detail__eyebrow"></span>' +
          '<h3 class="lk-detail__title"></h3>' +
          '<p class="lk-detail__sub"></p>' +
          '<p class="lk-detail__desc"></p>' +
          '<h4 class="lk-detail__label"></h4>' +
          '<ul class="lk-detail__list"></ul>' +
          '<p class="lk-detail__focus"></p>' +
        '</div>' +
      '</div></div>';
    var q = function (c) { return box.querySelector('.lk-detail__' + c); };
    return {
      root: box, panel: q('panel'), close: q('close'), img: box.querySelector('.lk-detail__media img'),
      eyebrow: q('eyebrow'), title: q('title'), sub: q('sub'), desc: q('desc'),
      label: q('label'), list: q('list'), focus: q('focus')
    };
  }
  function tr(obj) { return obj ? (obj[lang] || obj.id) : ''; }

  function fillModal(m, svc, sub) {
    var d = DETAILS[sub.label.id];
    m.root.style.setProperty('--lk-accent', svc.color);
    m.root.style.setProperty('--lk-accent-sub', sub.color);
    m.img.src = d.img;
    m.eyebrow.textContent = tr(svc.title);
    m.title.textContent = tr(d.title);
    m.sub.textContent = tr(d.sub);
    m.desc.textContent = tr(d.desc);
    m.close.setAttribute('aria-label', lang === 'en' ? 'Close details' : 'Tutup rincian');
    // ulangi animasi masuk setiap kali isi berganti
    m.panel.classList.remove('is-swap');
    void m.panel.offsetWidth;
    m.panel.classList.add('is-swap');

    m.label.textContent = d.list.label ? tr(d.list.label) + ':' : '';
    m.label.hidden = !d.list.label;
    m.list.textContent = '';
    d.list.items.forEach(function (it) {
      var li = document.createElement('li');
      if (it instanceof Array) {                 // [tebal, teks]
        var b = document.createElement('strong');
        b.textContent = tr(it[0]) + ': ';
        li.appendChild(b);
        li.appendChild(document.createTextNode(tr(it[1])));
      } else {
        li.textContent = tr(it);
      }
      m.list.appendChild(li);
    });

    m.focus.textContent = '';
    var fb = document.createElement('strong');
    fb.textContent = tr(d.focus.label) + ': ';
    m.focus.appendChild(fb);
    m.focus.appendChild(document.createTextNode(tr(d.focus.text)));
  }

  // render keseluruhan
  function render(root) {
    root.textContent = '';
    var fit = el('div', 'lk-fit');
    var stage = el('div', 'lk-stage');
    fit.appendChild(stage);
    root.appendChild(fit);

    var track = renderTrack(stage);
    prepareTrack(track);

    var groups = SERVICES.map(function (svc, n) {
      var g = renderGroup(svc, n, track);
      stage.appendChild(g);
      return g;
    });
    return { stage: stage, track: track, groups: groups };
  }

  // Animasi & interaksi
  function init() {
    var section = document.querySelector(CONFIG.sectionSelector);
    var root = document.querySelector(CONFIG.rootSelector);
    if (!section || !root) return;

    renderHeading(section);
    var view = render(root);
    var stage = view.stage, groups = view.groups, track = view.track;

    var played = false;       // animasi desktop sudah jalan
    var activeIndex = -1;
    var openIdx = -1;         // indeks grup yang sub-layanannya sedang terbuka (-1 = semua tertutup)
    var hovering = false;
    var autoTimer = null;

    // panel rincian sub-layanan: muncul tepat di bawah tombol yang diklik
    var modal = buildDetail(root);
    var box = modal.root;
    var desktopMQ = window.matchMedia('(min-width: 1200px)');
    var openKey = null, selectedPill = null;
    var lookup = {};
    SERVICES.forEach(function (svc) {
      svc.subs.forEach(function (sub) { if (DETAILS[sub.label.id]) lookup[sub.label.id] = { svc: svc, sub: sub }; });
    });
    function selectPill(pill) {
      if (selectedPill) { selectedPill.classList.remove('is-selected'); selectedPill.setAttribute('aria-expanded', 'false'); }
      selectedPill = pill || null;
      if (selectedPill) { selectedPill.classList.add('is-selected'); selectedPill.setAttribute('aria-expanded', 'true'); }
    }
    // desktop: panel melayang di kanvas tepat di bawah pill; mobile: panel di dalam kartu, di bawah deretan pill
    function placePanel() {
      if (!openKey || !selectedPill) return;
      if (box.parentNode === stage) {
        var W = stage.clientWidth;
        var w = Math.min(680, W - 24);
        var pc = selectedPill.offsetLeft + selectedPill.offsetWidth / 2;
        var left = Math.max(12, Math.min(W - w - 12, pc - w / 2));
        var top = selectedPill.offsetTop + selectedPill.offsetHeight + 2;
        var SH = 30;                                  // ruang di kiri/kanan agar bayangan panel tidak terpotong
        box.style.width = (w + SH * 2) + 'px';
        box.style.left = (left - SH) + 'px';
        box.style.top = top + 'px';
        box.style.setProperty('--arrow-x', Math.max(36, Math.min(w - 36, pc - left)) + 'px');
        var over = top + 24 + modal.panel.offsetHeight + 20 - stage.offsetHeight;   // beri ruang agar tidak menimpa konten di bawah
        stage.style.marginBottom = over > 0 ? Math.ceil(over) + 'px' : '';
      } else {
        box.style.width = box.style.left = box.style.top = '';
        stage.style.marginBottom = '';
      }
    }
    function revealPanel() {
      var r = box.getBoundingClientRect();
      var ph = modal.panel.offsetHeight;
      var pill = selectedPill ? selectedPill.getBoundingClientRect() : r;
      var bottom = r.top + ph + 16;
      var delta = 0;
      if (bottom > window.innerHeight - 16) delta = Math.min(bottom - window.innerHeight + 24, Math.max(0, pill.top - 100));
      else if (pill.top < 90) delta = pill.top - 120;
      if (Math.abs(delta) > 4) window.scrollBy({ top: delta, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    function openDetail(key, pill) {
      var hit = lookup[key];
      if (!hit) return;
      if (openKey === key) { closeDetail(true); return; }       // klik lagi = tutup
      var desktop = desktopMQ.matches;
      var host = desktop ? stage : pill.closest('.lk-group');
      var wasOpen = !!openKey;
      openKey = key;
      selectPill(pill);
      box.style.setProperty('--lk-accent', hit.svc.color);
      fillModal(modal, hit.svc, hit.sub);
      var moved = false;
      if (desktop ? box.parentNode !== stage : box.parentNode !== host) {
        moved = true;
        box.classList.add('no-anim');
        box.classList.remove('is-open');
        if (desktop) stage.appendChild(box);
        else host.querySelector('.lk-subs').insertAdjacentElement('afterend', box);
        box.classList.toggle('is-floating', desktop);
        placePanel();
        void box.offsetWidth;
        box.classList.remove('no-anim');
      } else {
        placePanel();
      }
      modal.close.setAttribute('tabindex', '0');
      window.requestAnimationFrame(function () { box.classList.add('is-open'); });
      window.setTimeout(revealPanel, (moved || !wasOpen) ? 320 : 120);
    }
    function closeDetail(restoreFocus) {
      if (!openKey) return;
      openKey = null;
      var pill = selectedPill;
      selectPill(null);
      box.classList.remove('is-open');
      stage.style.marginBottom = '';
      modal.close.setAttribute('tabindex', '-1');
      if (restoreFocus && pill && pill.focus) { try { pill.focus({ preventScroll: true }); } catch (e) { /* abaikan */ } }
    }
    modal.close.setAttribute('tabindex', '-1');
    modal.close.addEventListener('click', function () { closeDetail(true); });
    // klik/tombol di dalam panel tidak boleh menyorot grup induknya (mobile: panel ada di dalam kartu)
    box.addEventListener('click', function (e) { e.stopPropagation(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDetail(true);
      e.stopPropagation();
    });
    // didaftarkan lebih dulu dari handler grup, agar klik sub-pill membuka rincian (bukan menyorot grup)
    stage.addEventListener('click', function (e) {
      var sp = e.target.closest ? e.target.closest('.lk-sub[data-detail]') : null;
      if (!sp) return;
      e.stopImmediatePropagation();
      openDetail(sp.getAttribute('data-detail'), sp);
    });
    stage.addEventListener('keydown', function (e) {
      var sp = e.target.closest ? e.target.closest('.lk-sub[data-detail]') : null;
      if (!sp) return;
      if (e.key === 'Escape') { if (openKey) { e.stopImmediatePropagation(); closeDetail(true); } return; }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      openDetail(sp.getAttribute('data-detail'), sp);
    });
    // desktop: klik di luar panel menutupnya
    document.addEventListener('click', function (e) {
      if (!openKey || !desktopMQ.matches) return;
      if (box.contains(e.target) || (e.target.closest && e.target.closest('.lk-sub[data-detail]'))) return;
      closeDetail(false);
    });
    var resizeT = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(function () {
        if (!openKey) return;
        var floating = box.parentNode === stage;
        if (floating !== desktopMQ.matches) { closeDetail(false); box.classList.remove('is-floating'); }
        else placePanel();
      }, 120);
    });

    // buka / tutup sub-layanan per grup
    function setGroupOpen(idx, open) {
      var g = groups[idx];
      g.classList.toggle('lk-open', open);
      var b = g.querySelector('.lk-main__btn');
      if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
      g.querySelectorAll('.lk-sub[data-detail]').forEach(function (s) {
        s.setAttribute('tabindex', open ? '0' : '-1');
      });
    }
    function collapseAll() {
      if (openKey) closeDetail(false);
      if (openIdx > -1) { setGroupOpen(openIdx, false); openIdx = -1; }
    }
    function toggleGroup(idx) {
      var prev = openIdx;
      if (openKey) closeDetail(false);                 // rincian milik grup lama ikut tertutup
      if (prev > -1) setGroupOpen(prev, false);
      openIdx = prev === idx ? -1 : idx;
      if (openIdx > -1) setGroupOpen(openIdx, true);
      setActive(openIdx, openIdx > -1);
    }
    function restActive() { setActive(openIdx, openIdx > -1); }   // kembali ke sorotan grup yang terbuka

    // sorotan
    // dim = true  -> layanan lain diredupkan (hover/fokus/klik pengguna)
    // dim = false -> hanya menyorot (sorotan otomatis)
    function setActive(idx, dim) {
      activeIndex = idx;
      groups.forEach(function (g, i) { g.classList.toggle('is-active', i === idx); });
      stage.classList.toggle('has-active', !!dim && idx > -1 && mqDesktop.matches);
    }

    // animasi ular (desktop) — progres 0..1 menggerakkan semuanya
    var segs = track.segs, head = track.head;
    function renderProgress(p) {
      var d = p * track.L;
      segs.forEach(function (sg) {
        var drawn = Math.min(sg.visible, Math.max(0, d - sg.dist));
        sg.path.style.strokeDashoffset = sg.visible - drawn;
      });
      groups.forEach(function (g) {
        var on = d >= g._at;
        if (on !== g._on) { g._on = on; g.classList.toggle('lk-play', on); }
      });
      var si = 0;
      while (si < segs.length - 1 && d > segs[si].dist + segs[si].len) si++;
      var sg = segs[si];
      var pt = sg.path.getPointAtLength(Math.min(sg.len, Math.max(0, d - sg.dist)));
      head.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      track.headBody.setAttribute('fill', TRACK[si].color);
      head.style.color = TRACK[si].color;
      head.style.opacity = (d > 0 && p < 0.985) ? 1 : 0;
    }
    function resetGroups() {
      groups.forEach(function (g) { g._on = false; g.classList.remove('lk-play'); });
    }
    function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }   // sama seperti ular lama

    var raf = 0;
    function finishSnake() {
      stage.classList.add('lk-done');
      startAutoplay();
    }
    function playDesktop() {
      played = true;
      cancelAnimationFrame(raf);
      resetGroups();
      stage.classList.remove('lk-done');
      var t0 = performance.now();
      (function tick(now) {
        var t = Math.min(1, (now - t0) / CONFIG.snakeDuration);
        renderProgress(ease(t));
        if (t < 1) raf = requestAnimationFrame(tick); else finishSnake();
      })(t0);
    }
    function resetDesktop() {
      played = false;
      cancelAnimationFrame(raf);
      stopAutoplay();
      collapseAll();
      setActive(-1);
      stage.classList.remove('lk-done');
      resetGroups();
      renderProgress(0);
    }

    // animasi masuk (mobile): per kartu saat terlihat
    function observeGroupsForMobile() {
      if (!('IntersectionObserver' in window)) {
        groups.forEach(function (g) { g.classList.add('lk-play'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('lk-play'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      groups.forEach(function (g) { g.style.setProperty('--n', 0); io.observe(g); });
    }

    // pemicu saat masuk viewport (diputar ulang tiap masuk lagi)
    function startWhenVisible() {
      if (reduceMotion || !('IntersectionObserver' in window)) {
        groups.forEach(function (g) { g.classList.add('lk-play'); });
        renderProgress(1);
        finishSnake();
        return;
      }
      renderProgress(0);
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!mqDesktop.matches) return;
          if (en.intersectionRatio >= 0.25 && !played) playDesktop();   // sekali jalan; setelah itu tetap stabil
        });
      }, { threshold: [0, 0.25] }).observe(stage);

      if (!mqDesktop.matches) observeGroupsForMobile();
    }

    /* judul */
    if ('IntersectionObserver' in window && !reduceMotion) {
      var hio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { section.classList.add('lk-heading-in'); hio.disconnect(); }
      }, { threshold: 0.2 });
      hio.observe(section.querySelector('.lk-heading'));
    } else {
      section.classList.add('lk-heading-in');
    }

    // sorotan otomatis
    function stopAutoplay() {
      if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; }
    }
    function startAutoplay() {
      if (!CONFIG.autoplay || reduceMotion || autoTimer) return;
      autoTimer = window.setInterval(function () {
        if (hovering || openIdx > -1 || document.hidden || !mqDesktop.matches) return;
        setActive((activeIndex + 1) % groups.length, false);
      }, CONFIG.autoplayInterval);
      if (mqDesktop.matches && !hovering && openIdx < 0) setActive(0, false);
    }

    // interaksi pointer / fokus / klik
    stage.addEventListener('pointerover', function (e) {
      if (e.pointerType === 'touch') return;
      var g = e.target.closest ? e.target.closest('.lk-group') : null;
      if (g) { hovering = true; setActive(groups.indexOf(g), true); }
      else if (hovering) { hovering = false; restActive(); }
    });
    stage.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'touch') return;
      hovering = false;
      restActive();
    });
    stage.addEventListener('focusin', function (e) {
      var g = e.target.closest('.lk-group');
      if (g) { hovering = true; setActive(groups.indexOf(g), true); }
    });
    stage.addEventListener('focusout', function () { hovering = false; restActive(); });
    // klik pill utama / foto -> buka atau tutup sub-layanan grup itu
    stage.addEventListener('click', function (e) {
      var g = e.target.closest('.lk-group');
      if (!g || !e.target.closest('.lk-main, .lk-photo')) return;
      toggleGroup(groups.indexOf(g));
    });
    // Enter / Spasi ditangani tombol bawaan; Escape menutup grup yang terbuka
    stage.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || openIdx < 0) return;
      var idx = openIdx;
      toggleGroup(idx);
      var b = groups[idx].querySelector('.lk-main__btn');
      if (b) { try { b.focus({ preventScroll: true }); } catch (err) { /* abaikan */ } }
    });

    // ganti breakpoint saat resize
    function onBreakpoint() {
      collapseAll();
      setActive(-1);
      if (mqDesktop.matches) {
        if (!played && stage.getBoundingClientRect().top < window.innerHeight) playDesktop();
        else if (played) startAutoplay();
      } else {
        groups.forEach(function (g) { g.classList.add('lk-play'); });
      }
    }
    if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onBreakpoint);
    else if (mqDesktop.addListener) mqDesktop.addListener(onBreakpoint);

    // bahasa (tombol EN/ID di navbar)
    function applyLang(l) {
      lang = l;
      var scope = [section];
      scope.forEach(function (s) {
        s.querySelectorAll('[data-id][data-en]').forEach(function (n) {
          var t = n.getAttribute('data-' + l);
          if (t != null && n.textContent !== t) n.textContent = t;
        });
      });
      groups.forEach(function (g, i) { g.setAttribute('aria-label', SERVICES[i].title[l]); });
      if (openKey) fillModal(modal, lookup[openKey].svc, lookup[openKey].sub);
    }
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        window.setTimeout(function () {
          var d = detectLang();
          applyLang(d !== lang ? d : (lang === 'id' ? 'en' : 'id'));
        }, 150);
      });
    }
    if (window.MutationObserver) {
      new MutationObserver(function () {
        var d = detectLang();
        if (d !== lang) applyLang(d);
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }

    startWhenVisible();
    if (lang !== 'id') applyLang(lang);

    /* akses cepat untuk debugging di console: DECHO_LAYANAN.setActive(2) */
    window.DECHO_LAYANAN = { services: SERVICES, setActive: setActive, replay: function () { window.location.reload(); } };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
