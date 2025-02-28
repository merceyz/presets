import { PluginItem } from '@babel/core'; // eslint-disable-line import/no-extraneous-dependencies
import { Configuration } from 'webpack'; // eslint-disable-line import/no-extraneous-dependencies
import { logger } from '@storybook/node-logger';

interface BabelOptions {
  extends: string | null;
  plugins: PluginItem[] | null;
  presets: PluginItem[] | null;
}

const ie11Preset = [
  '@babel/preset-env',
  {
    targets: {
      ie: '11',
    },
  },
];

const plugins = [require.resolve('@babel/plugin-transform-classes')];

export const babel = (config: BabelOptions): BabelOptions => {
  const { presets = [] } = config;
  return {
    ...config,
    presets: [...(presets as PluginItem[]), ie11Preset],
    plugins,
  };
};

export const managerBabel = (config: BabelOptions): BabelOptions => {
  const { presets = [] } = config;
  return {
    ...config,
    presets: [...(presets as PluginItem[]), ie11Preset],
  };
};

const include = /[\\/]node_modules[\\/](@storybook\/node-logger|are-you-es5|better-opn|boxen|chalk|commander|find-cache-dir|find-up|fs-extra|json5|node-fetch|pkg-dir|resolve-from|semver)/;
const es6Loader = {
  test: /\.js$/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        sourceType: 'unambiguous',
        presets: [ie11Preset],
        plugins,
      },
    },
  ],
  include,
};

export const managerWebpack = (
  webpackConfig: Configuration = {},
): Configuration => ({
  ...webpackConfig,
  module: {
    ...webpackConfig.module,
    rules: [...(webpackConfig.module?.rules ?? []), es6Loader],
  },
});

export const webpack = (webpackConfig: Configuration = {}): Configuration => {
  logger.info(`=> Using IE11 preset`);
  return {
    ...webpackConfig,
    module: {
      ...webpackConfig.module,
      rules: [...(webpackConfig.module?.rules ?? []), es6Loader],
    },
  };
};
