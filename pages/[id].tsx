import { GetServerSideProps } from 'next';
import { supabase } from '../lib/supabase';

export default function Redirect() {
  // 이 페이지는 실제로 렌더링되지 않음 (서버 사이드에서 리다이렉트됨)
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  // Supabase에서 원본 URL 조회
  const { data, error } = await supabase
    .from('urls')
    .select('original_url')
    .eq('id', id)
    .single();

  if (error || !data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // 원본 URL로 리다이렉트
  return {
    redirect: {
      destination: data.original_url,
      permanent: false,
    },
  };
};