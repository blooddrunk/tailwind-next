import Link from 'next/link';

export const DefaultLayout = ({ children }) => {
  return (
    <main className="tw-min-h-screen tw-p-6 tw-bg-teal-100">
      <section className="tw-flex tw-flex-col tw-items-center tw-pt-20">
        <h2 className="tw-py-5">
          <Link href="/">
            <a className="tw-text-3xl tw-text-indigo-500 tw-font-bold">Examples</a>
          </Link>
        </h2>
        <div className="tw-container">{children}</div>
      </section>
    </main>
  );
};
