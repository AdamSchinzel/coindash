import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import ExploreWithAI from "./ExploreWithAI";
import Portfolio from "./Portfolio";

const TabNavigation = () => {
  return (
    <Tabs width={["96%", "96%", "70%", "60%"]} mt={8} colorScheme="teal">
      <TabList>
        <Tab>Portfolio</Tab>
        <Tab>Explore with AI</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Portfolio />
        </TabPanel>
        <TabPanel>
          <ExploreWithAI />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabNavigation;
