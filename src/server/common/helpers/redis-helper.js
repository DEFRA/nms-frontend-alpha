class RedisHelper {
  constructor(redis, server) {
    this.client = redis
    this.server = server
  }

  async storeData(id, data) {
    const storedData = await this.getData(id)
    let newData
    if (Array.isArray(data)) {
      newData = data
    }

    if (
      typeof data === 'object' &&
      typeof storedData === 'object' &&
      !Array.isArray(data) &&
      !Array.isArray(storedData)
    ) {
      newData = { ...storedData, ...data }
    }

    await this.client.set(id, JSON.stringify(newData))

    this.server.logger.debug(
      {
        ...storedData,
        ...data
      },
      'Redis store data'
    )

    return await this.getData(id)
  }

  async getData(id) {
    const data = await this.client.get(id)
    const response = data ? JSON.parse(data) : null

    this.server.logger.debug({ data: response }, 'Redis get data')

    return response
  }

  async getAll() {
    const keys = []
    let cursor = '0'
    do {
      const [newCursor, results] = await this.client.scan(cursor)
      cursor = newCursor
      keys.push(results)
    } while (cursor !== '0')
    const response = keys ?? null

    this.server.logger.debug({ data: response }, 'Redis get all')

    return response
  }

  async removeData(id) {
    await this.client.del(id)

    this.server.logger.info(`Redis store data: ${id} removed`)
    return id
  }
}

export { RedisHelper }
