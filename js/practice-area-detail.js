/* ============================================
   PRACTICE AREA DETAIL PAGE JAVASCRIPT
   ============================================ */

window.initPracticeAreaDetail = () => {
    // Get practice area from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const area = urlParams.get('area');

    const practiceAreas = {
        'labor': {
            title: 'İş Hukuku',
            content: `
                <p>İş hukuku, işçi ve işveren arasındaki ilişkileri düzenleyen hukuk dalıdır. Bu alanda, iş sözleşmelerinden işten çıkarma süreçlerine, iş kazalarından meslek hastalıklarına kadar geniş bir yelpazede hizmet vermekteyiz.</p>
                <p>İş sözleşmelerinin hazırlanması, değiştirilmesi ve sonlandırılması süreçlerinde müvekkillerimize danışmanlık hizmeti sunuyoruz. İşten çıkarma süreçlerinde, işçi haklarının korunması ve işveren yükümlülüklerinin yerine getirilmesi konularında uzman desteği sağlıyoruz.</p>
                <p>İş kazaları ve meslek hastalıkları durumunda, tazminat davalarının açılması ve takibi konusunda deneyimli ekibimizle hizmet veriyoruz. Ayrıca, iş hukuku alanındaki güncel mevzuat değişikliklerini takip ederek, müvekkillerimizi bilgilendiriyoruz.</p>
                <p>Toplu iş sözleşmeleri, sendika hakları ve çalışma koşulları ile ilgili uyuşmazlıkların çözümünde de aktif rol alıyoruz. İş hukuku alanındaki tüm süreçlerde, müvekkillerimizin haklarını en iyi şekilde korumak için çalışıyoruz.</p>
                <p>İş mahkemelerinde açılan davalarda, deneyimli avukat kadromuzla müvekkillerimizi temsil ediyor, en iyi sonuçları elde etmek için stratejik yaklaşımlar geliştiriyoruz. İş hukuku alanındaki uzmanlığımız ve deneyimimizle, müvekkillerimize güvenilir hukuki destek sağlıyoruz.</p>
            `
        },
        'employment': {
            title: 'Çalışma Hukuku',
            content: `
                <p>Çalışma hukuku, çalışma hayatındaki tüm ilişkileri düzenleyen ve çalışanların haklarını koruyan hukuk dalıdır. Bu alanda, toplu iş sözleşmelerinden sendika haklarına, grev ve lokavt süreçlerinden çalışma koşullarına kadar kapsamlı hizmet sunuyoruz.</p>
                <p>Toplu iş sözleşmelerinin hazırlanması ve müzakere süreçlerinde, hem işçi hem de işveren tarafını temsil ediyoruz. Sendika hakları ve sendikal faaliyetlerle ilgili tüm hukuki süreçlerde danışmanlık hizmeti veriyoruz.</p>
                <p>Grev ve lokavt süreçlerinde, yasal çerçevede hareket edilmesini sağlayarak, tarafların haklarını koruyoruz. Çalışma koşulları, ücret, izin ve diğer çalışan hakları ile ilgili uyuşmazlıkların çözümünde aktif rol alıyoruz.</p>
                <p>Çalışma hayatındaki ayrımcılık, mobbing ve diğer haksız uygulamalar karşısında, çalışanların haklarını korumak için hukuki destek sağlıyoruz. Çalışma hukuku alanındaki güncel gelişmeleri takip ederek, müvekkillerimizi bilgilendiriyoruz.</p>
                <p>Çalışma Bakanlığı ve ilgili kurumlarla olan ilişkilerde, müvekkillerimize danışmanlık hizmeti sunuyoruz. Çalışma hukuku alanındaki tüm süreçlerde, deneyimli ekibimizle profesyonel hizmet veriyoruz.</p>
            `
        },
        'family': {
            title: 'Aile Hukuku',
            content: `
                <p>Aile hukuku, aile bireyleri arasındaki ilişkileri düzenleyen hukuk dalıdır. Bu alanda, boşanma davalarından velayet ve nafaka konularına, miras hukukundan evlat edinme süreçlerine kadar geniş bir yelpazede hizmet vermekteyiz.</p>
                <p>Boşanma davalarında, anlaşmalı ve çekişmeli boşanma süreçlerinde müvekkillerimize danışmanlık ve temsil hizmeti sunuyoruz. Velayet davalarında, çocuğun yüksek yararı ilkesini gözeterek, en iyi çözümü bulmak için çalışıyoruz.</p>
                <p>Nafaka konularında, iştirak ve yoksulluk nafakası davalarının açılması ve takibi konusunda uzman desteği sağlıyoruz. Mal rejimi ve mal paylaşımı konularında, adil bir paylaşım için hukuki süreçleri yönetiyoruz.</p>
                <p>Miras hukuku alanında, mirasçılık sıfatı, miras paylaşımı, vasiyetname ve miras reddi konularında danışmanlık hizmeti veriyoruz. Evlat edinme süreçlerinde, yasal gerekliliklerin yerine getirilmesi konusunda destek sağlıyoruz.</p>
                <p>Aile içi şiddet ve koruma kararları konularında, mağdur tarafların haklarını korumak için hukuki destek sunuyoruz. Aile hukuku alanındaki tüm süreçlerde, hassas yaklaşım and profesyonel hizmet anlayışımızla müvekkillerimizin yanındayız.</p>
            `
        },
        'real-estate': {
            title: 'Gayrimenkul Hukuku',
            content: `
                <p>Gayrimenkul hukuku, taşınmaz mallarla ilgili tüm hukuki işlemleri kapsayan hukuk dalıdır. Bu alanda, tapu işlemlerinden kira sözleşmelerine, inşaat hukukundan kamulaştırma süreçlerine kadar kapsamlı hizmet sunuyoruz.</p>
                <p>Tapu işlemlerinde, alım-satım, devir, ipotek ve diğer tapu işlemlerinin yasal çerçevede gerçekleştirilmesi konusunda danışmanlık hizmeti veriyoruz. Kira sözleşmelerinin hazırlanması, değiştirilmesi ve sonlandırılması süreçlerinde müvekkillerimize destek sağlıyoruz.</p>
                <p>İnşaat hukuku alanında, inşaat sözleşmeleri, müteahhit hakları, yapı ruhsatları ve iskan işlemleri konularında uzman danışmanlık hizmeti sunuyoruz. Kat mülkiyeti ve yönetim planları konularında, yasal gerekliliklerin yerine getirilmesi için destek veriyoruz.</p>
                <p>Kamulaştırma süreçlerinde, kamulaştırma bedelinin belirlenmesi ve tazminat davalarının açılması konularında hukuki destek sağlıyoruz. Gayrimenkul alım-satım işlemlerinde, tarafların haklarını korumak için sözleşmelerin hazırlanması ve takibi konusunda hizmet veriyoruz.</p>
                <p>Gayrimenkul ile ilgili uyuşmazlıkların çözümünde, deneyimli ekibimizle müvekkillerimizi temsil ediyoruz. Gayrimenkul hukuku alanındaki tüm süreçlerde, güvenilir and profesyonel hukuki destek sunuyoruz.</p>
            `
        }
    };

    const practiceArea = practiceAreas[area] || practiceAreas['labor'];

    // Update page title
    const titleEl = document.getElementById('practice-area-title');
    if (titleEl) titleEl.textContent = practiceArea.title;

    document.title = `${practiceArea.title} - Öztürk Avukatlık`;

    // Update content
    const contentEl = document.getElementById('practice-area-content');
    if (contentEl) contentEl.innerHTML = practiceArea.content;
};

document.addEventListener('DOMContentLoaded', () => {
    window.initPracticeAreaDetail();
});
