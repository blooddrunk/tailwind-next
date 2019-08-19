import { Button } from 'antd';

const Home = () => (
  <div>
    <h1 className="tw-bg-red-400 tw-text-white">Tailwind</h1>
    <Button>{process.env.TEST}</Button>
  </div>
);

export default Home;
