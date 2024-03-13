import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      favicon: '/favicon.ico',
      locales: {
        root: {
          label: 'Português',
          lang: 'pt-BR',
        },
      },
      title: 'Next Auth',
      editLink: {
        baseUrl:
          'https://github.com/codante-io/workshop-ts-no-react-guia/edit/main/',
      },
      social: {
        github: 'https://github.com/robertotcestari',
        'x.com': 'https://x.com/robertotcestari',
        linkedin: 'https://www.linkedin.com/in/robertotcestari/',
        email: 'mailto:robertotcestari@gmail.com',
      },
      customCss: ['./src/tailwind.css'],
      sidebar: [
        {
          label: 'Intro ao Workshop',
          autogenerate: {
            directory: '00-intro',
          },
        },

        {
          label: 'Intro ao NextAuth',
          autogenerate: {
            directory: '01-intro-nextauth',
          },
        },

        {
          label: 'Login com Credenciais',
          autogenerate: {
            directory: '02-login-com-credenciais',
          },
        },
      ],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
