# Supply Chain Map

![SupplyChainMap Logo](https://github.com/googleinterns/supply-chain-map/blob/master/web/scm/src/assets/scm_logo.png?raw=true)

**This is not an officially supported Google product.**

This project is to enable end-to-end interactive geographical visualization and
customized dashboards for risk analysis of the given supply chain entities.

## Overview

Supply Chain Map is a customized analytical dashboard that enables end-to-end product risk analysis using interactive geographical visualization by leveraging a centralized data warehouse.

Currently, the most of supply chaindata is dispersed across disparate systems and no systematic process to identify and mitigate risk. The goal of this project is to experiment the feasability of leveraging the available data to render a risk heat map and thereby identify, assess and mitigate any potential risk to the supply chain.

## Setup

### Prerequisites

- Node.js and npm
- Bigquery: Should

### Installation

1. Clone the project
```
git clone https://github.com/googleinterns/supply-chain-map.git
```
2. Change directory to the source code directory
```
cd supply-chain-map/web/scm
```
3. Install all necessary dependencies
```
npm i
```
4. Duplicate the sample environment file
```
cp src/environments/environment.sample.ts src/environments/environment.ts
```
5. Edit the environment file with necessary credentials
```
vi  src/environments/environment.ts
```
6. (Optional) Edit the constants file with actual datasets/table/column names
```
vi  constants.ts
```
7. Run the application
```
npm start
```

## Source Code Headers

Every file containing source code must include copyright and license
information. This includes any JS/CSS files that you might be serving out to
browsers. (This is to help well-intentioned people avoid accidental copying that
doesn't comply with the license.)

Apache header:

    Copyright 2020 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
