import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import koutelier from '../../assest/images/koutelier.jpg';
import LeftArro from '../../assest/images/l1.png';
import morphic from '../../assest/images/morphic.png';
import RightArro from '../../assest/images/r3.png';
import styles from '../../styles/navbar.module.css';

const HomeCarousel = () => {
  return (
    <div
      className="container"
      style={{
        borderRadius: '8px',
        marginTop: '134px',
      }}
    >
      <h2
        style={{
          marginTop: '15px',
          fontSize: '64px',
          lineHeight: '74px',
          fontWeight: '800',
          padding: '24px',
          marginBottom: '60px',
        }}
        className="text-center"
      >
        WHAT OTHERS SAY
      </h2>
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ height: '700px' }}
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
        </div>
        <div
          className="carousel-inner"
          style={{
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: '#151720',
          }}
        >
          <div className="carousel-item active">
            <span style={{ float: 'left' }}>
              <Image
                className={styles.carouselQ}
                src={LeftArro}
                alt="working flow"
                width={72}
                height={72}
              />
            </span>

            <p className={styles.carouselTitle}>
              Hey there fellow creatives! I&apos;m stoked to celebrate this wild
              NFT minting service on the Ergo blockchain. Let&apos;s unleash our
              inner artists and dive into the amazing future of digital
              masterpieces. It&apos;s time to turn dreams into reality!
            </p>
            <span style={{ float: 'right' }}>
              <Image
                className={styles.carouselQ}
                src={RightArro}
                alt="working flow"
                width={72}
                height={72}
              />
            </span>
            <Image
              src={koutelier}
              style={{ width: '133px', height: '133px' }}
              className="d-block w-100 object-contain "
              alt="..."
            />

            <p
              className="text-center pt-4"
              style={{
                fontWeight: '400',
                fontSize: '24px',
                fontFamily: `'Inter', sans-serif`,
              }}
            >
              koutelier, $COMET Founder
            </p>
          </div>
          <div className="carousel-item">
            <span style={{ float: 'left' }}>
              <Image
                className={styles.carouselQ}
                src={LeftArro}
                alt="working flow"
                width={72}
                height={72}
              />
            </span>
            <p className={styles.carouselTitle}>
              Lilium implemented the latest features of EIP-34 in Appkit and
              used AVL trees to implement a state of the art NFT collection
              minter. Great work.
            </p>
            <span style={{ float: 'right' }}>
              <Image
                className={styles.carouselQ}
                src={RightArro}
                alt="working flow"
                width={72}
                height={72}
              />
            </span>
            <Image
              style={{ width: '133px', height: '133px', marginTop: 124 }}
              src={morphic}
              className="d-block w-100 object-contain "
              alt="..."
            />
            <p
              className="text-center pt-4"
              style={{
                fontWeight: '400',
                fontSize: '24px',
                fontFamily: `'Inter', sans-serif`,
              }}
            >
              Alexander Slesarenko, Ergo Core Dev
            </p>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default HomeCarousel;
