import GatsbyLink from 'gatsby-link';
import Heading from '@react/react-spectrum/Heading';
import Link from '../components/Link';
import React from 'react';

export default function Header() {
  return (
    <header>
      <nav>
        <Heading size={3}><GatsbyLink to="/">react-spectrum</GatsbyLink></Heading>
        <Link href="/components/Accordion">Docs</Link>
        <Link href="/guides/getting_started">Guides</Link>
        <Link href="/community">Community</Link>
        <Link href="http://react-spectrum.corp.adobe.com" target="_blank">Storybook</Link>
        <Link href="http://git.corp.adobe.com/React/react-spectrum/releases" target="_blank">Releases</Link>
        <Link href="https://git.corp.adobe.com/React/react-spectrum" target="_blank">Github</Link>
      </nav>
    </header>
  );
}
