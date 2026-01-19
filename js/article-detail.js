window.initArticleDetail = () => {
    // Get article ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const articles = {
        '1': {
            title: 'İş Hukukunda Yeni Düzenlemeler',
            date: '15 Ocak 2024',
            content: `
                <p>2024 yılında iş hukuku alanında yapılan önemli değişiklikler, hem işçi hem de işverenleri yakından ilgilendirmektedir. Bu yazıda, yeni düzenlemelerin detaylarını ve etkilerini inceleyeceğiz.</p>
                <p>İş Kanunu'nda yapılan değişiklikler, özellikle iş sözleşmeleri, çalışma saatleri ve izin hakları konularında önemli güncellemeler içermektedir. İşçilerin haklarını koruyan bu düzenlemeler, aynı zamanda işverenlerin yükümlülüklerini de netleştirmektedir.</p>
                <p>Yeni düzenlemeler kapsamında, uzaktan çalışma düzenlemeleri de güncellenmiştir. Pandemi sonrası yaygınlaşan uzaktan çalışma modeli, artık daha net bir hukuki çerçeveye kavuşturulmuştur. İşçilerin uzaktan çalışma hakları ve işverenlerin yükümlülükleri detaylandırılmıştır.</p>
                <p>İşten çıkarma süreçlerinde de önemli değişiklikler yapılmıştır. İşverenlerin, işten çıkarma nedenlerini daha detaylı açıklama yükümlülüğü getirilmiştir. Bu düzenleme, işçilerin haklarını korumak ve şeffaflığı artırmak amacıyla yapılmıştır.</p>
                <p>İş kazaları ve meslek hastalıkları konusunda da güncellemeler yapılmıştır. İşverenlerin güvenlik önlemleri alma yükümlülükleri artırılmış, işçilerin sağlık ve güvenlik hakları güçlendirilmiştir.</p>
                <p>Bu değişikliklerin, işçi ve işveren ilişkilerini nasıl etkileyeceği, uygulamada karşılaşılabilecek sorunlar ve çözüm önerileri hakkında detaylı bilgi için bizimle iletişime geçebilirsiniz.</p>
            `
        },
        '2': {
            title: 'Aile Hukukunda Velayet Davaları',
            date: '10 Ocak 2024',
            content: `
                <p>Velayet davaları, aile hukukunun en hassas konularından biridir. Bu yazıda, velayet davalarında dikkat edilmesi gereken noktalar ve süreçler hakkında bilgi vereceğiz.</p>
                <p>Velayet, çocuğun kişiliği, eğitimi, bakımı ve temsil edilmesi ile ilgili hak ve yükümlülüklerdir. Velayet davalarında, mahkeme her zaman çocuğun yüksek yararını gözetir. Bu ilke, velayet kararlarının verilmesinde en önemli kriterlerden biridir.</p>
                <p>Velayet davalarında, çocuğun yaşı, cinsiyeti, ebeveynlerle olan ilişkisi, ebeveynlerin maddi ve manevi durumları gibi birçok faktör değerlendirilir. Mahkeme, çocuğun gelişimi ve refahı için en uygun kararı vermeye çalışır.</p>
                <p>Velayet davalarında, çocuğun görüşü de önemlidir. Belirli bir yaşın üzerindeki çocukların görüşleri, mahkeme tarafından dikkate alınır. Ancak, çocuğun görüşü tek başına belirleyici değildir; diğer faktörlerle birlikte değerlendirilir.</p>
                <p>Velayet kararları, değişen koşullara göre değiştirilebilir. Eğer velayet sahibi ebeveyn, çocuğun bakımını ve eğitimini yeterince yerine getiremiyorsa, diğer ebeveyn velayet değişikliği davası açabilir.</p>
                <p>Velayet davalarında, uzman avukat desteği almak çok önemlidir. Deneyimli bir avukat, sürecin doğru yönetilmesi ve çocuğun yüksek yararının korunması için gerekli stratejileri geliştirebilir.</p>
            `
        },
        '3': {
            title: 'Gayrimenkul Alım-Satım Süreçleri',
            date: '5 Ocak 2024',
            content: `
                <p>Gayrimenkul alım-satım işlemleri, önemli yatırımlar ve hukuki süreçler içermektedir. Bu yazıda, gayrimenkul alım-satım süreçlerinde dikkat edilmesi gereken noktalar hakkında bilgi vereceğiz.</p>
                <p>Gayrimenkul alım-satım işlemlerinde, öncelikle taşınmazın tapu durumunun kontrol edilmesi gerekir. Tapu kaydında, taşınmazın üzerinde ipotek, şerh veya başka bir yükümlülük olup olmadığı kontrol edilmelidir.</p>
                <p>Alım-satım sözleşmesinin hazırlanması, sürecin en önemli aşamalarından biridir. Sözleşmede, tarafların kimlik bilgileri, taşınmazın tanımı, satış bedeli, ödeme şekli ve tarihi, teslim tarihi gibi önemli hususlar yer almalıdır.</p>
                <p>Gayrimenkul alım-satım işlemlerinde, noter huzurunda sözleşme düzenlenmesi zorunludur. Noter, sözleşmenin yasal gerekliliklere uygun olmasını sağlar and tarafların haklarını korur.</p>
                <p>Satış bedelinin ödenmesi ve tapu devrinin yapılması, sürecin son aşamalarıdır. Satış bedeli, genellikle noter huzurunda veya banka aracılığıyla ödenir. Tapu devri, tapu müdürlüğünde yapılır ve taşınmazın yeni sahibi tapuya kaydedilir.</p>
                <p>Gayrimenkul alım-satım işlemlerinde, vergi yükümlülükleri de önemlidir. Alıcı ve satıcı, işlemden kaynaklanan vergi yükümlülüklerini yerine getirmelidir. Bu konuda, mali müşavir veya avukat desteği alınması önerilir.</p>
            `
        },
        '4': {
            title: 'Çalışma Hukukunda Sendika Hakları',
            date: '28 Aralık 2023',
            content: `
                <p>Sendika hakları, çalışanların örgütlenme ve toplu pazarlık haklarının temelidir. Bu yazıda, sendika hakları ve çalışanların örgütlenme özgürlüğü hakkında bilgi vereceğiz.</p>
                <p>Çalışanlar, anayasal bir hak olarak sendika kurma, sendikaya üye olma ve sendikal faaliyetlerde bulunma hakkına sahiptir. Bu hak, işverenler tarafından engellenemez ve çalışanların sendikal faaliyetleri nedeniyle ayrımcılığa uğraması yasaktır.</p>
                <p>Sendikalar, çalışanların haklarını korumak, toplu iş sözleşmeleri yapmak ve çalışma koşullarını iyileştirmek için çalışır. Sendikalar, ayrıca çalışanların eğitim, sosyal ve kültürel ihtiyaçlarını karşılamak için faaliyetlerde bulunabilir.</p>
                <p>Toplu iş sözleşmeleri, sendikalar ve işverenler arasında yapılan ve çalışma koşullarını düzenleyen sözleşmelerdir. Bu sözleşmeler, ücret, çalışma saatleri, izin hakları ve diğer çalışma koşullarını belirler.</p>
                <p>Grev ve lokavt, toplu iş uyuşmazlıklarının çözümü için kullanılan yasal araçlardır. Grev, çalışanların toplu olarak işi bırakması; lokavt ise işverenin işyerini geçici olarak kapatmasıdır. Bu haklar, yasal çerçevede kullanılmalıdır.</p>
            `
        },
        '5': {
            title: 'Miras Hukuku ve Vasiyetname',
            date: '20 Aralık 2023',
            content: `
                <p>Miras hukuku, kişinin ölümünden sonra mal varlığının kimlere ve nasıl geçeceğini düzenleyen hukuk dalıdır. Bu yazıda, miras hukuku ve vasiyetname konuları hakkında bilgi vereceğiz.</p>
                <p>Miras, ölen kişinin mal varlığıdır. Mirasçılar, kanuni mirasçılar ve atanmış mirasçılar olarak ikiye ayrılır. Kanuni mirasçılar, yasal olarak mirasçı olan kişilerdir; atanmış mirasçılar ise vasiyetname ile belirlenen kişilerdir.</p>
                <p>Vasiyetname, kişinin ölümünden sonra mal varlığının nasıl paylaştırılacağını belirleyen yasal belgedir. Vasiyetname, resmi vasiyetname, el yazısı vasiyetname ve sözlü vasiyetname olmak üzere üç şekilde düzenlenebilir.</p>
                <p>Miras paylaşımı, mirasçıların yasal paylarına göre yapılır. Ancak, vasiyetname ile bu paylaşım değiştirilebilir. Mirasçılar, mirası kabul edebilir veya reddedebilir. Mirasın reddi, belirli süre içinde yapılmalıdır.</p>
                <p>Miras hukuku, karmaşık bir alandır ve uzman avukat desteği alınması önerilir. Miras paylaşımı, vasiyetname düzenleme ve miras reddi gibi konularda, deneyimli bir avukat size yardımcı olabilir.</p>
            `
        },
        '6': {
            title: 'Boşanma Süreçleri ve Haklar',
            date: '15 Aralık 2023',
            content: `
                <p>Boşanma, evlilik birliğinin yasal olarak sona erdirilmesidir. Bu yazıda, boşanma süreçleri ve tarafların hakları hakkında bilgi vereceğiz.</p>
                <p>Boşanma, anlaşmalı boşanma ve çekişmeli boşanma olmak üzere iki şekilde gerçekleşebilir. Anlaşmalı boşanmada, taraflar boşanma koşullarını birlikte belirler ve mahkemeye başvurur. Çekişmeli boşanmada ise, taraflar anlaşamaz ve mahkeme karar verir.</p>
                <p>Boşanma davalarında, velayet, nafaka ve mal paylaşımı gibi konular da ele alınır. Velayet, çocuğun bakımı ve eğitimi ile ilgili hak ve yükümlülüklerdir. Nafaka, eşlerden birinin diğerine veya çocuklara ödemesi gereken maddi destektir.</p>
                <p>Mal paylaşımı, evlilik birliği süresince edinilen malların paylaştırılmasıdır. Türk Medeni Kanunu'na göre, edinilmiş mallara katılma rejimi geçerlidir. Bu rejimde, eşler evlilik süresince edindikleri malları paylaşır.</p>
                <p>Boşanma süreçleri, duygusal ve hukuki açıdan zorlu olabilir. Bu süreçte, uzman avukat desteği almak, haklarınızı korumak ve sürecin doğru yönetilmesi için önemlidir.</p>
            `
        }
    };

    const article = articles[articleId] || articles['1'];

    // Check if elements exist before updating
    const titleEl = document.getElementById('article-title');
    const dateEl = document.getElementById('article-date');
    const contentEl = document.getElementById('article-content');

    if (titleEl) titleEl.textContent = article.title;
    if (dateEl) dateEl.textContent = article.date;
    if (contentEl) contentEl.innerHTML = article.content;

    document.title = `${article.title} - Öztürk Avukatlık`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', article.title + ' - Öztürk Avukatlık tarafından hazırlanan hukuki makale.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.initArticleDetail();
});

