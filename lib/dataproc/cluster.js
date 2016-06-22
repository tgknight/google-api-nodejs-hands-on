'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const extend = require('lodash').extend
const Auth = require('../common/auth')
const promisifier = require('../util').promisifier

/**
 * Wrapper for Google Cloud Dataproc cluster
 *
 * @constructor
 * @alias {module:dataproc/cluster}
 *
 * @param {object} config - Configuration options
 * @param {string} config.clusterName - Name of the cluster
 * @param {string} config.bucket - name of the bucket to be associated with
 */
class Cluster {
  constructor(config) {
    this.config = config
    this.auth = new Auth()
    this.authClient = this.auth.authenticate()
    this.dataproc = google.dataproc('v1')
    Promise.promisifyAll(this.dataproc.projects.regions.clusters, { promisifier })
  }

  /**
   * Create a cluster
   *
   * @param {object} clusterConfig - Additional cluster configuration options
   * @param {string} clusterConfig.zone - Name of a resource zone of the cluster
   * @param {string} clusterConfig.masterType - Name of a Compute Engine instance type for
   *     master node
   * @param {string} clusterConfig.workerType - name of a Compute Engine instance type for
   *     worker nodes
   * @param {number} clusterConfig.workerNodeNumber - A number of Compute Engine instances
   *     that will be provided as worker nodes
   * @return {Promise} promise - Either resolves to dataproc/cluster, or rejects an error
   */
  create(clusterConfig) {
    const params = {
      auth: this.auth.authClient,
      projectId: this.config.projectId,
      region: 'global',
      resource: {
        projectId: this.config.projectId,
        clusterName: this.config.clusterName,
        config: {
          configBucket: this.config.bucket,
          gceClusterConfig: {
            zoneUri: 'https://www.googleapis.com/compute/v1/projects/' +
              this.config.projectId + '/zones/' +
              'asia-east1-a',
            networkUri: 'https://www.googleapis.com/compute/v1/projects/' +
              this.config.projectId + '/global/networks/default',
            tags: ['datana'],
          },
          masterConfig: {
            numInstances: 1,
            machineTypeUri: 'https://www.googleapis.com/compute/v1/projects/' +
              this.config.projectId + '/zones/' +
              clusterConfig.zone + '-a' + '/machineTypes/' +
              clusterConfig.masterType,
            diskConfig: {
              bootDiskSizeGb: 500,
              numLocalSsds: 0,
            },
          },
          workerConfig: {
            numInstances: clusterConfig.workerNodeNumber,
            machineTypeUri: 'https://www.googleapis.com/compute/v1/projects/' +
              this.config.projectId + '/zones/' +
              clusterConfig.zone + '-a' + '/machineTypes/' +
              clusterConfig.workerType,
            diskConfig: {
              bootDiskSizeGb: 500,
              numLocalSsds: 0,
            },
          },
          softwareConfig: {
            imageVersion: '1.0',
          },
          initializationActions: [
            {
              executableFile: 'gs://' + this.config.bucket + '/cluster-management/cluster.sh',
            },
          ],
        },
      },
    }

    return new Promise((resolve, reject) => {
      this.dataproc.projects.regions.clusters.createAsync(params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Get a dataproc/cluster reference
   *
   * @return {Promise} promise - Either resolves to dataproc/cluster, or rejects an error
   */
  get() {
    const params = {
      auth: this.authClient,
      projectId: this.config.projectId,
      clusterName: this.config.clusterName,
    }

    return new Promise((resolve, reject) => {
      this.dataproc.projects.regions.clusters.getAsync(params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Update a cluster
   *
   * @param {object} clusterConfig - Configuration options to be updated
   * @param {number} clusterConfig.workerNodeNumber - A number of Compute Engine instances
   *     that will be provided as cluster worker nodes
   * @return {Promise} promise - Either resolves to dataproc/cluster, or rejects an error
   */
  update(clusterConfig) {
    const params = {
      auth: this.auth.authClient,
      projectId: this.config.projectId,
      clusterName: this.config.clusterName,
      updateMask: 'configuration.worker_configuration.num_instances',
      resource: {
        projectId: this.config.projectId,
        clusterName: this.config.clusterName,
        config: {
          workerConfig: {
            numInstances: clusterConfig.workerNodeNumber,
          },
        },
      },
    }

    return new Promise((resolve, reject) => {
      this.dataproc.projects.regions.clusters.patchAsync(params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Delete the cluster
   *
   * @return {Promise} promise - Either resolves, or rejects an error
   */
  delete() {
    const params = {
      auth: this.auth.authClient,
      projectId: this.config.projectId,
      clusterName: this.config.clusterName,
    }

    return new Promise((resolve, reject) => {
      this.dataproc.projects.regions.clusters.deleteAsync(params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * List all clusters belonging to the project
   *
   * @param {string} region - A region to list clusters
   * @return {Promise} promise - Either resolves to list of dataproc/cluster,
   *      or rejects an error
   */
  list(region) {
    const params = {
      auth: this.auth.authClient,
      projectId: this.config.projectId,
      region,
    }
    return new Promise((resolve, reject) => {
      this.dataproc.projects.regions.clusters.listAsync(params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}

module.exports = Cluster
