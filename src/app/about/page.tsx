import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const pageTitle = "Kod Dünyası Hakkında";
  const pageSubtitle = "Yazılım dünyasının en güncel bilgilerini ve en iyi uygulamalarını paylaşıyoruz.";
  
  const aboutUs = {
    title: "Biz Kimiz?",
    content: [
      "Blog Sitesi, 2020 yılında bir grup tutkulu yazılım geliştirici tarafından kuruldu. Amacımız, yazılım dünyasındaki en son gelişmeleri, en iyi uygulamaları ve pratik ipuçlarını hem yeni başlayanlara hem de deneyimli geliştiricilere ulaştırmaktır.",
      "Blogumuzda web geliştirme, mobil uygulama geliştirme, veri bilimi, yapay zeka ve daha birçok konuda makaleler bulabilirsiniz."
    ],
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Kod Dünyası Ekibi"
  };

  const missionVision = {
    mission: {
      title: "Misyonumuz",
      content: "Yazılım geliştirme topluluğuna değer katmak, bilgi paylaşımını teşvik etmek ve geliştiricilerin kariyerlerinde ilerlemelerine yardımcı olmak için kaliteli içerik sunmak."
    },
    vision: {
      title: "Vizyonumuz",
      content: "Yazılım dünyasında güvenilir bir bilgi kaynağı olmak ve global ölçekte geliştiricileri birbirine bağlayan bir platform haline gelmek."
    }
  };

  const offerings = [
    { title: "Güncel Makaleler", description: "En son teknolojiler ve trendler hakkında derinlemesine yazılar" },
    { title: "Kod Örnekleri", description: "Pratik problemlere yönelik çözümler ve örnek uygulamalar" },
    { title: "Video Eğitimler", description: "Karmaşık konuları basitleştiren adım adım video rehberler" },
    { title: "Topluluk Forumu", description: "Sorularınızı sorabileceğiniz ve diğer geliştiricilerle etkileşime geçebileceğiniz bir platform" }
  ];

  const stats = [
    { number: "500+", text: "Yayınlanan Makale" },
    { number: "50K+", text: "Aylık Ziyaretçi" },
    { number: "10K+", text: "Forum Üyesi" },
    { number: "100+", text: "Video Eğitim" }
  ];

  const callToAction = {
    title: "Bize Katılın",
    content: "Siz de yazılım dünyasının heyecan verici yolculuğunda bize katılın. Makalelerimizi okuyun, forumumuzda tartışmalara katılın ve birlikte öğrenelim!",
    buttonText: "Hemen Üye Ol",
    buttonLink: "/user/register"
  };

  return (
    <div className="container my-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold">{pageTitle}</h1>
        <p className="lead text-muted">{pageSubtitle}</p>
      </header>

      <section className="row align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="mb-3">{aboutUs.title}</h2>
          {aboutUs.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="col-md-6">
          <Image
            src={aboutUs.imageUrl}
            alt={aboutUs.imageAlt}
            width={500}
            height={300}
            className="img-fluid rounded shadow-lg"
          />
        </div>
      </section>

      <section className="bg-light p-5 rounded-3 mb-5">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h3 className="mb-3">{missionVision.mission.title}</h3>
            <p>{missionVision.mission.content}</p>
          </div>
          <div className="col-md-6">
            <h3 className="mb-3">{missionVision.vision.title}</h3>
            <p>{missionVision.vision.content}</p>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="text-center mb-4">Neler Sunuyoruz?</h2>
        <div className="row">
          {offerings.map((item, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="mb-4">Rakamlarla Kod Dünyası</h2>
        <div className="row">
          {stats.map((item, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="border rounded p-3">
                <h3 className="display-4 fw-bold text-primary">{item.number}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 text-center">
        <h2 className="mb-4">{callToAction.title}</h2>
        <p className="lead">{callToAction.content}</p>
        <Link href={callToAction.buttonLink} className="btn btn-primary btn-lg mt-3">
          {callToAction.buttonText}
        </Link>
      </section>
    </div>
  );
}