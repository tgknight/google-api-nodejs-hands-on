'use strict'

const Cluster = require('./cluster')
const merge = require('lodash').merge

/**
 * Entry point for accessing Google Cloud Dataproc
 *
 * @constructor
 * @alias {module:dataproc}
 *
 * @param {object} config - Configuration options
 * @param {string} config.keyFilename - Full path to the JSON key
 */
class Dataproc {
  constructor (config) {
    this.config = config
  }

  /**
   * Create a cluster wrapper. See {module:dataproc/cluster} for more details
   *
   * @param {object} clusterConfig - Cluster configuration options
   * @param {string} clusterConfig.clusterName - Name of the cluster
   * @param {string} clusterConfig.bucket - Name of a bucket to be associated with
   * @return {module:dataproc/cluster}
   */
  cluster (clusterConfig) {
    const { clusterName, bucket } = clusterConfig
    return new Cluster(merge(this.config, { clusterName, bucket }))
  }
}

module.exports = Dataproc
