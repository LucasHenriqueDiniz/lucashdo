/* eslint-disable react/jsx-props-no-spreading */
import Image from 'next/image';
import React from 'react';
import { IllustratorIcon as IllustratorSvg } from '../../../public';

export default function IllustratorIcon(props: React.ComponentProps<'span'>) {
  return (
    <span {...props}>
      <Image
        src={IllustratorSvg}
        alt="Illustrator"
        width={24}
        height={24}
        style={{ display: 'inline-block' }}
      />
    </span>
  );
}
