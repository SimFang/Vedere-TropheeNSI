import { t } from "../../localization"; 
import tutoillu1 from "../../assets/images/tutorial/tutoillu1.png"; 
import tutoillu2 from "../../assets/images/tutorial/tutoillu2.png"; 
import tutoilludone from "../../assets/images/tutorial/tutoilludone.png"; 
import tutoillufilters from "../../assets/images/tutorial/tutoillufilters.png"; 
import tutoillumeet from "../../assets/images/tutorial/tutoillumeet.png"; 
import tutoilluorders from "../../assets/images/tutorial/tutoilluorders.png"; 
import tutoilluphotographers from "../../assets/images/tutorial/tutoilluphotographers.png"; 
import tutoilluproposition from "../../assets/images/tutorial/tutoilluproposition.png"; 
import tutoilluvisualise from "../../assets/images/tutorial/tutoilluvisualise.png"; 



export const tutorialData = [
  {
    title: t('tutorial.howToFindPhotographers.title'), // Title of the first tutorial
    description: t('tutorial.howToFindPhotographers.description'), // Description of the first tutorial
    sections: [
      {
        illustration: tutoillu1, // Local image import for illustration
        text: t('tutorial.howToFindPhotographers.section1.text')
      },
      {
        illustration: tutoillufilters, // URL for illustration
        text: t('tutorial.howToFindPhotographers.section2.text')
      },
      {
        illustration: tutoilluphotographers, // URL for illustration
        text: t('tutorial.howToFindPhotographers.section3.text')
      },
    ],
  },
  {
    title: t('tutorial.converseWithPhotographers.title'), // Title of the second tutorial
    description: t('tutorial.converseWithPhotographers.description'), // Description of the second tutorial
    sections: [
      {
        illustration: tutoillu2, // URL for illustration
        text: t('tutorial.converseWithPhotographers.section1.text')
      },
      {
        illustration: tutoilluproposition, // URL for illustration
        text: t('tutorial.converseWithPhotographers.section2.text')
      },
    ],
  },
  {
    title: t('tutorial.seeYourShootings.title'), // Title of the third tutorial
    description: t('tutorial.seeYourShootings.description'), // Description of the third tutorial
    sections: [
      {
        illustration: tutoilluorders, // URL for illustration
        text: t('tutorial.seeYourShootings.section1.text')
      },
    ],
  },
  {
    title: t('tutorial.seeOrder.title'), // Title of the second tutorial
    description: t('tutorial.seeOrder.description'), // Description of the second tutorial
    sections: [
      {
        illustration: tutoillumeet, // URL for illustration
        text: t('tutorial.seeOrder.section1.text')
      },
      {
        illustration: tutoilludone, // URL for illustration
        text: t('tutorial.seeOrder.section2.text')
      },
      {
        illustration: tutoilluvisualise, // URL for illustration
        text: t('tutorial.seeOrder.section3.text')
      },
    ],
  },
  // More tutorial objects can be added if needed
];