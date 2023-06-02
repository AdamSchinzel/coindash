import Heading from "../elements/Heading";
import TabNavigation from "../modules/TabsNavigator";
import Wallets from "../modules/Wallets";

const Home = () => {
  return (
    <>
      <Heading text="CoinDash" description="Crypto portfolio tracker with a focus on simplicity and privacy" />
      <Wallets />
      <TabNavigation />
    </>
  );
};

export default Home;
