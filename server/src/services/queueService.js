/**
 * Queue Service — Lightweight in-memory job queue.
 * In production, swap this for Bull/BullMQ backed by Redis.
 */

const queues = new Map();
const handlers = new Map();

/**
 * Create a named queue.
 */
const createQueue = (name) => {
  if (!queues.has(name)) {
    queues.set(name, []);
    console.log(`[Queue] Created queue: ${name}`);
  }
  return queues.get(name);
};

/**
 * Register a handler for a queue.
 */
const registerHandler = (queueName, handler) => {
  handlers.set(queueName, handler);
};

/**
 * Add a job to a queue.
 * @param {string} queueName
 * @param {Object} data - Job payload
 * @param {Object} options - { delay, priority }
 * @returns {Object} Job info
 */
const addJob = async (queueName, data, options = {}) => {
  const queue = createQueue(queueName);

  const job = {
    id: `${queueName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    queue: queueName,
    data,
    status: 'pending',
    createdAt: new Date(),
    attempts: 0,
    maxAttempts: options.maxAttempts || 3,
  };

  queue.push(job);

  // Process immediately in dev mode (no Redis)
  if (options.delay) {
    setTimeout(() => processJob(job), options.delay);
  } else {
    setImmediate(() => processJob(job));
  }

  return { id: job.id, queue: queueName, status: 'queued' };
};

/**
 * Process a single job.
 */
const processJob = async (job) => {
  const handler = handlers.get(job.queue);
  if (!handler) {
    console.warn(`[Queue] No handler for queue: ${job.queue}`);
    return;
  }

  job.status = 'processing';
  job.attempts++;

  try {
    await handler(job.data);
    job.status = 'completed';
    job.completedAt = new Date();
  } catch (error) {
    console.error(`[Queue] Job ${job.id} failed:`, error.message);
    job.status = job.attempts >= job.maxAttempts ? 'failed' : 'pending';
    job.error = error.message;

    // Retry with exponential backoff
    if (job.status === 'pending') {
      const delay = Math.pow(2, job.attempts) * 1000;
      setTimeout(() => processJob(job), delay);
    }
  }
};

/**
 * Get queue stats.
 */
const getStats = () => {
  const stats = {};
  for (const [name, jobs] of queues.entries()) {
    stats[name] = {
      total: jobs.length,
      pending: jobs.filter((j) => j.status === 'pending').length,
      processing: jobs.filter((j) => j.status === 'processing').length,
      completed: jobs.filter((j) => j.status === 'completed').length,
      failed: jobs.filter((j) => j.status === 'failed').length,
    };
  }
  return stats;
};

module.exports = { createQueue, registerHandler, addJob, getStats };
