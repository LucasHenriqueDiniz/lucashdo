/* eslint-disable react/jsx-props-no-spreading */
import Image from 'next/image';
import React from 'react';
import { ZustandLogo } from '../../../public';

export default function ZustandIcon(props: React.ComponentProps<'span'>) {
  return (
    <span {...props}>
      <Image
        src={ZustandLogo}
        alt="Zustand"
        width={24}
        height={24}
        style={{ display: 'inline-block', borderRadius: 4 }}
      />
    </span>
  );
}
