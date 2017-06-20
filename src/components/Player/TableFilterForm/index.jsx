/* global API_HOST */
import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import querystring from 'querystring';
import strings from 'lang';
import { toggleShowForm } from 'actions/formActions';
import Form from 'components/Form/Form';
import FormGroup from 'components/Form/FormGroup';
import styles from './TableFilterForm.css';
import * as data from './TableFilter.config';

export const FORM_NAME = 'tableFilter';

const getPeers = (props, context) => {
  fetch(`${API_HOST}/api/players/${props.playerId}/peers`)
  .then(resp => resp.json())
  .then(json => context.setState({ peers: json }));
};

const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm();
  }
};

class TableFilterForm extends React.Component {
  constructor() {
    super();
    this.state = {
      peers: [],
    };
  }

  componentDidMount() {
    setShowFormState(this.props);
    getPeers(this.props, this);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.playerId !== this.props.playerId) {
      setShowFormState(nextProps);
      getPeers(nextProps, this);
    }
  }

  render() {
    const { showForm, currentQueryString, history } = this.props;
    const formSelectionState = querystring.parse(currentQueryString.substring(1));
    return (
      <div>
        <div className={showForm ? styles.showForm : styles.hideForm}>
          <Form name={FORM_NAME} className={styles.form}>
            <FormGroup formSelectionState={formSelectionState} history={history}>
              {Field => (
                <div className={styles.formGroup}>
                  <Field
                    name="hero_id"
                    label={strings.filter_hero_id}
                    dataSource={data.heroList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="is_radiant"
                    label={strings.filter_is_radiant}
                    dataSource={data.factionList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="win"
                    label={strings.filter_win}
                    dataSource={data.resultList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="lane_role"
                    label={strings.filter_lane_role}
                    dataSource={data.laneList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="patch"
                    label={strings.filter_patch}
                    dataSource={data.patchList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="game_mode"
                    label={strings.filter_game_mode}
                    dataSource={data.modeList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="lobby_type"
                    label={strings.filter_lobby_type}
                    dataSource={data.lobbyTypeList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="date"
                    label={strings.filter_date}
                    dataSource={data.dateList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="region"
                    label={strings.filter_region}
                    dataSource={data.regionList}
                    strict
                    limit={1}
                  />
                  <Field
                    name="with_hero_id"
                    label={strings.filter_with_hero_id}
                    dataSource={data.heroList}
                    strict
                    limit={5}
                  />
                  <Field
                    name="against_hero_id"
                    label={strings.filter_against_hero_id}
                    dataSource={data.heroList}
                    strict
                    limit={5}
                  />
                  <Field
                    name="included_account_id"
                    label={strings.filter_included_account_id}
                    dataSource={this.state.peers.map(peer => ({ text: `${peer.personaname}`, value: peer.account_id }))}
                    limit={10}
                  />
                  <Field
                    name="excluded_account_id"
                    label={strings.filter_excluded_account_id}
                    dataSource={this.state.peers.map(peer => ({ text: `${peer.personaname}`, value: peer.account_id }))}
                  />
                  <Field
                    name="significant"
                    label={strings.filter_significant}
                    dataSource={data.significantList}
                    strict
                    limit={1}
                  />
                </div>
              )}
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showForm: state.app.form.show,
  currentQueryString: window.location.search,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm(FORM_NAME)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TableFilterForm));
