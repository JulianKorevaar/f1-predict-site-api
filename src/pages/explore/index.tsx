import { SetStateAction, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Background } from '../../components/background/Background';
import { HeroOneInput } from '../../components/hero/HeroOneInput';
import { Section } from '../../layout/Section';

type IProps = {
  url: string;
};

const LandingPage: NextPage<IProps> = ({ url }) => {
  const router = useRouter();

  const [name, setName] = useState('');

  const handleButtonClick = async () => {
    const res = await fetch(`${url}/users/${name.toLowerCase()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://f1-predict-site-api.vercel.app',
      },
    });
    const user = await res.json();

    if (user.length === 0) {
      await fetch(`${url}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':
            'https://f1-predict-site-api.vercel.app',
        },
        body: JSON.stringify({
          name: name.toLowerCase(),
          points: 0,
          current_gp: 0,
        }),
      }).then(() => {
        localStorage.setItem('name', name.toLowerCase());
      });
    } else {
      localStorage.setItem('name', name.toLowerCase());
    }

    await router.push('/predict');
  };

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setName(event.target.value);
  };

  return (
    <Background color="bg-gray-100" className="h-screen fixed inset-0">
      <Section yPadding="pt-20 pb-32">
        <HeroOneInput
          title={<>{'Vul je naam in\n'}</>}
          input={
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Let op dat je je naam goed invult."
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-lg text-center"
              style={{ fontSize: '1.25rem' }}
              value={name}
              onChange={handleInputChange}
            ></input>
          }
          button={
            <button
              type="submit"
              className="w-1/2 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
              onClick={handleButtonClick}
            >
              Start met voorspellen
            </button>
          }
        />
      </Section>
    </Background>
  );
};

export const getStaticProps: GetServerSideProps = async () => {
  return {
    props: {
      url: process.env.API_URL,
    },
  };
};

export default LandingPage;
