import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
export default function Custom404() {
  const router = useRouter();

  return (
    <div className="error-container">
      <Head>
        <title>404 - Page Not Found</title>
      </Head>

      <main className="error-main">
        <div className="error-content">
          {/* <Image src={require("/assets/img/404.png")} alt="404" width={100} height={100} /> */}
          <p className="error-oh-no">Oh No!</p>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-description">
            The page you requested, doesn't exist or was removed. We suggest you to visit our home page,
            or go back by clicking here.
          </p>
          <div className="error-button-container">
            <button
              className="error-button home-button"
              onClick={() => router.push('/')}
            >
              Home
            </button>
            <button
              className="error-button back-button"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
