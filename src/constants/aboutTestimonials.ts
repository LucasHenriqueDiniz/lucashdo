import { TranslatedField } from '@/types/experience.types';

interface aboutTestimonialsProp {
  name: string;
  role: TranslatedField;
  date: string;
  content: TranslatedField;
  link?: string;
  image?: string;
}

export const aboutTestimonials: aboutTestimonialsProp[] = [
  {
    name: 'Rodrigo Schardong',
    role: {
      pt: 'Fundador da Engenharia do Futuro e Seu IoT',
      en: 'Founder of Engenharia do Futuro and Seu IoT',
    },
    date: '7 de novembro de 2024',
    content: {
      pt: 'Trabalhei com o Lucas no projeto do Seu IoT e pude testemunhar seu crescimento como desenvolvedor web. Das características que me surpreenderam foram o seu aprendizado rápido e a qualidade na entrega das tarefas em que ele foi responsável. Trabalhamos juntos de forma remota e assíncrona e deu super certo. Recomendo a todos da rede.',
      en: 'I worked with Lucas on the Seu IoT project and witnessed his growth as a web developer. What surprised me the most were his quick learning abilities and the quality of the tasks he was responsible for. We worked together remotely and asynchronously, and it worked out great. I highly recommend him to everyone in the network.',
    },
    link: 'https://www.linkedin.com/in/rodrigoschardong/',
    image:
      'https://media.licdn.com/dms/image/v2/D4D03AQH83XVRhb7Hgg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726609890619?e=1755734400&v=beta&t=lzcOEd_DlNmT_UeHNBGKSKEDAzriF7HxLB2NGSWz2eY',
  },
  {
    name: 'Gabriel Soares',
    role: {
      pt: 'Engenheiro de Software',
      en: 'Software Engineer',
    },
    date: '8 de novembro de 2024',
    content: {
      pt: 'Tive o prazer de trabalhar com o Lucas em diversos projetos. Sua dedicação e habilidades técnicas foram fundamentais para o sucesso do projeto. Ele é um profissional comprometido e sempre busca a excelência em tudo que faz. Recomendo fortemente!',
      en: 'I had the pleasure of working with Lucas on several projects. His dedication and technical skills were fundamental to the success of the project. He is a committed professional and always strives for excellence in everything he does. I highly recommend him!',
    },
    link: 'https://www.linkedin.com/in/soaresgabe/',
    image:
      'https://media.licdn.com/dms/image/v2/D4D03AQFNRNi4fsN2dA/profile-displayphoto-shrink_800_800/B4DZRymK1PHUAc-/0/1737089396869?e=1755734400&v=beta&t=lnL4B3PC1bEaZyhR70myBdAqcsV1rqTdCfOKPPjBDfs',
  },
];
