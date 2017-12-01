import helpers from '@/helpers';

// List of GCP Products with card info
const rootIconPath = '/static/icons/gcp';

const bigDataIconPath = `${rootIconPath}/Big Data`;
const bigData = {
  BQ: {
    icon: `${bigDataIconPath}/BigQuery.svg`,
    name: 'Big Query',
  },
  DATAFLOW: {
    icon: `${bigDataIconPath}/Cloud Dataflow.svg`,
    name: 'Cloud Dataflow',
  },
  DATALAB: {
    icon: `${bigDataIconPath}/Cloud Datalab.svg`,
    name: 'Cloud Datalab',
  },
  DATAPREP: {
    icon: `${bigDataIconPath}/Cloud Dataprep.svg`,
    name: 'Cloud Dataprep',
  },
  DATAPROC: {
    icon: `${bigDataIconPath}/Coud Dataproc.svg`,
    name: 'Cloud Dataproc',
  },
  PUBSUB: {
    icon: `${bigDataIconPath}/Cloud PubSub.svg`,
    name: 'Cloud Pub/Sub',
  },
  DATASTUDIO: {
    icon: `${bigDataIconPath}/Data Studio.svg`,
    name: 'Data Studio',
  },
  GENOMICS: {
    icon: `${bigDataIconPath}/Genomics.svg`,
    name: 'Genomics',
  },
};

const computeIconPath = `${rootIconPath}/Compute`;
const compute = {
  GAE: {
    icon: `${computeIconPath}/App Engine.svg`,
    name: 'App Engine',
  },
  FUNCTIONS: {
    icon: `${computeIconPath}/Cloud Functions.svg`,
    name: 'Cloud Functions',
  },
  GCE: {
    icon: `${computeIconPath}/Compute Engine.svg`,
    name: 'Compute Engine',
  },
  GKE: {
    icon: `${computeIconPath}/Container Engine.svg`,
    name: 'Kubernetes Engine',
  },
};

const dtIconPath = `${rootIconPath}/Developer Tools`;
const devTools = {
  'DEPLOYMENT MANAGER': {
    icon: `${dtIconPath}/Cloud Deployment Manager.svg`,
    name: 'Cloud Deployment Manager',
  },
  'CONTAINER BUILDER': {
    icon: `${dtIconPath}/Container Builder.svg`,
    name: 'Container Builder',
  },
  'CONTAINER REGISTRY': {
    icon: `${dtIconPath}/Container Registry.svg`,
    name: 'Container Registry',
  },
};

const isIconPath = `${rootIconPath}/Identity & Security`;
const identitySecurity = {
  IAM: {
    icon: `${isIconPath}/Cloud IAM.svg`,
    name: 'Cloud IAM',
  },
  KMS: {
    icon: `${isIconPath}/Key Management Service.svg`,
    name: 'Key Management Service',
  },
  DLP: {
    icon: `${isIconPath}/Data Loss Prevention API.svg`,
    name: 'Data Loss Prevention API',
  },
  IAP: {
    icon: `${isIconPath}/Identity-Aware Proxy.svg`,
    name: 'Identity Aware Proxy',
  },
};


export default helpers.deepFreeze(Object.assign(
  bigData,
  compute,
  devTools,
  identitySecurity,
));
