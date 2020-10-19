import { ModelRouter } from '../common/model-router'

import * as restify from 'restify'
import { Review } from './reviews.model'
import * as mongoose from 'mongoose'

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review)
  }

  envelope(document) {
    let resource = super.envelope(document)
    const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
    resource._links.restaurant = `/restaurants/${restId}`
    return resource
  }

  protected prepareOne(query: mongoose.DocumentQuery<Review, Review>)
    : mongoose.DocumentQuery<Review, Review> {
    return query
      .populate('user', 'name')
      .populate('restaurant', 'name')
  }

  /*findById = (req, res, next) => {
    this.model.findById(req.params.id)
      .populate('user', 'name')
      .populate('restaurant', "name")
      .then(this.render(res, next))
      .catch(next)
  }
  */

  applyRoutes(application: restify.Server) {

    application.get(this.basePath, this.findAll)

    application.get(`${this.basePath}/:id`, [this.validateId, this.findById])

    application.post(this.basePath, this.save)
  }
}

export const reviewsRouter = new ReviewsRouter()