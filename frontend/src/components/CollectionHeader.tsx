import React from 'react';

interface CollectionHeaderProps {
  collectionType?: string;
}

const collectionData = {
  hottubs: {
    title: 'Hottubs',
    description: 'Ontdek onze collectie hoogwaardige hottubs. Of je nu op zoek bent naar een klassieke houten hottub of een moderne variant met jets, wij hebben voor elke wens de perfecte oplossing.',
    image: '/placeholders/collection-1.png'
  },
  saunas: {
    title: "Sauna's",
    description: 'Ontdek onze sauna\'s voor thuis en buiten. Kies uit verschillende houtsoorten, verwarmingsopties en afmetingen voor jouw ideale wellness-ervaring.',
    image: '/placeholders/collection-2.png'
  },
  inbouwsaunas: {
    title: 'Inbouwsauna\'s',
    description: 'Onze inbouwsauna\'s worden op maat gemaakt voor jouw ruimte. Kies uit verschillende houtsoorten, verwarmingstechnieken en extra opties voor jouw perfecte thuissauna.',
    image: '/placeholders/collection-2.png'
  },
  buitensaunas: {
    title: 'Buitensauna\'s',
    description: 'Onze buitensauna\'s zijn perfect voor in de tuin of op het terras. Ze zijn weerbestendig, duurzaam en bieden een authentieke sauna-ervaring in de buitenlucht.',
    image: '/placeholders/collection-3.png'
  },
  combi: {
    title: 'Combi Sets',
    description: 'Onze combi sets combineren een sauna met een hottub of ijsbad voor de ultieme wellness-ervaring. Perfect voor liefhebbers van het contrast tussen warm en koud.',
    image: '/placeholders/collection-4.png'
  },
  ijsbad: {
    title: 'IJsbaden',
    description: 'Onze ijsbaden zijn perfect voor een verfrissende duik na de sauna. Ze helpen bij spierontspanning, bevorderen de bloedsomloop en verhogen je weerstand.',
    image: '/placeholders/collection-5.png'
  },
  'cold-plunge': {
    title: 'Cold Plunge',
    description: 'Verfrissende cold plunge baden voor herstel, focus en dagelijkse wellness.',
    image: '/placeholders/collection-5.png'
  }
};

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collectionType = 'hottubs' }) => {
  const type = collectionType as keyof typeof collectionData;
  const data = collectionData[type] || collectionData.hottubs;
  
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div 
        className="h-[300px] md:h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${data.image})` }}
      ></div>
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{data.title}</h1>
          <p className="text-white text-lg max-w-3xl mx-auto">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;
