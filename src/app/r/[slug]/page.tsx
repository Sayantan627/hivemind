interface PageProps {
  params: {
    slug: string;
  };
}

const page = ({ params }: PageProps) => {
  const { slug } = params;
  return <div>page</div>;
};
export default page;
