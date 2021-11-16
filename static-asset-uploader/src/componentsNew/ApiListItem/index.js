import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

// semantic-ui
// import { Container, Card, Divider } from 'semantic-ui-react'

// store
import { useObserver } from 'mobx-react'
import { store } from 'services/state'

// utilities
import _ from 'lodash'
import {
  isRegistered,
  getLoginRedirectUrl
} from '../../services/self'
import { cognitoDomain, cognitoClientId } from '../../services/api'
import { updateUsagePlansAndApisList } from '../../services/api-catalog'

function getCognitoUrl (type) {
  const redirectUri = getLoginRedirectUrl()
  return `${cognitoDomain}/${type}?response_type=token&client_id=${cognitoClientId}&redirect_uri=${redirectUri}`
}

function getApisCustom () {
  const apiList = [].concat(_.get(store, 'apiList.generic', []), _.get(store, 'apiList.apiGateway', [])).map(api => ({
    group: api.apiId || api.id,
    id: api.apiStage || api.id,
    description: api.swagger.info.description,
    title: api.swagger.info.title,
    route: `/apis/${api.id}` + (api.apiStage ? '/' + api.apiStage : ''),
    stage: api.apiStage
  }))
  return apiList
}
getApisCustom()

export function getApi (cacheBust = false) {
  return updateUsagePlansAndApisList(cacheBust)
    .then(() => {
      // let thisApi

      const allApis = [].concat(store.apiList.apiGateway, store.apiList.generic)

      // if (allApis.length) {
      //   if (apiId === 'ANY' || apiId === 'FIRST') {
      //     thisApi = allApis[0]
      //   } else {
      //     thisApi = allApis.find(api => (api.apiId === apiId && api.apiStage === stage))

      //     if (!thisApi) {
      //       thisApi = allApis.find(api => (api.id.toString() === apiId))
      //     }
      //   }
      // }
      // if (selectIt) store.api = thisApi
      return allApis
    })
}

export default function ApiListItem () {
  const isLoaded = useObserver(() => store.apiList != null && store.apiList.loaded)
  const dataSet = useMemo(() => !store.apiList ? [] : [
    ...store.apiList.apiGateway.map(({ id, apiStage: stage, swagger, usagePlan }) => ({
      url: `/apis/${id}/${stage}`,
      title: `${swagger.info.title} - ${stage}`,
      stage: `${stage}`,
      description: swagger.info.description ? `${swagger.info.description}` : ''
    })),
    ...store.apiList.generic.map(({ id, swagger, apiStage: stage }) => {
      const api = {
        url: `/apis/${id}`,
        title: stage ? `${swagger.info.title} - ${stage}` : `${swagger.info.title}`,
        description: swagger.info.description ? `${swagger.info.description}` : ''
      }
      if (stage) api.stage = stage
      return api
    })
  ], [isLoaded]) // changed-eslint-disable-line chNGED-react-hooks/exhaustive-deps

  const [searchField, setSearchField] = useState('')
  const filteredApiList = dataSet.filter(api => api.title.toLowerCase().includes(searchField))

  const apiList = filteredApiList.map(api => (
    <Link to= {isRegistered() ? api.url : getCognitoUrl('login') } class="data-card" key= {api.id }>
      <h3>{api.title}</h3>
      <h4>stage: {api.stage}</h4>
      <p>{api.description.slice(0, 150).concat('...')}</p>
      <span class="link-text">
        View API
        <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8631 0.929124L24.2271 7.29308C24.6176 7.68361 24.6176 8.31677 24.2271 8.7073L17.8631 15.0713C17.4726 15.4618 16.8394 15.4618 16.4489 15.0713C16.0584 14.6807 16.0584 14.0476 16.4489 13.657L21.1058 9.00019H0.47998V7.00019H21.1058L16.4489 2.34334C16.0584 1.95281 16.0584 1.31965 16.4489 0.929124C16.8394 0.538599 17.4726 0.538599 17.8631 0.929124Z" fill="#01bf71"/>
        </svg>
      </span>
    </Link>
  ))

  return (
    <section className="api-wrapper">
      <div className="search__container">
        <p className="search__title">
       Search API List...
        </p>
        <input
          className="search__input"
          type="text"
          placeholder="Search API..."
          onChange={ e => setSearchField(e.target.value)}
        />
      </div>
      <div className="card__group">
        {apiList}
      </div>
    </section>
  )
}
