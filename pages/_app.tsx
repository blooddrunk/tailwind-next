import '@/assets/styles/tailwind.css';

import React from 'react';
import App from 'next/app';

import '../plugins/font-awesome';
import { LayoutComponentType, DefaultLayout } from '../layouts';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const Layout = (Component as LayoutComponentType).Layout || DefaultLayout;

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}
