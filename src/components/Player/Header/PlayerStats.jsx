import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  CardTitle,
} from 'material-ui/Card';
import ActionHelp from 'material-ui/svg-icons/action/help';
import Error from 'components/Error';
import Spinner from 'components/Spinner';
import strings from 'lang';
import PlayedWith from './PlayedWith';
import styles from './PlayerStats.css';

export const PlayerStatsCards = ({
    loading,
    error,
    partyRank,
    soloRank,
    mmrEstimate,
    wins,
    losses,
    compact,
    playerId,
    loggedInId,
  }) => {
  if (error) {
    return <Error />;
  }
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={compact ? styles.compactContainer : styles.container}>
      <div className={compact && styles.compactRow}>
        <CardTitle
          className={styles.playerStats}
          subtitle={<div className={styles.textSuccess}>{wins}</div>}
          title={strings.th_wins}
        />
        <CardTitle
          className={styles.playerStats}
          subtitle={<div className={styles.textDanger}>{losses}</div>}
          title={strings.th_losses}
        />
        <CardTitle
          className={styles.playerStats}
          subtitle={`${((wins / (wins + losses)) * 100).toFixed(2)}%`}
          title={strings.th_winrate}
        />
      </div>
      <div className={compact && styles.compactRow}>
        {soloRank && (
          <CardTitle
            className={styles.playerStats}
            subtitle={soloRank || 'N/A'}
            title={strings.th_solo_mmr}
          />
        )}
        {partyRank && (
          <CardTitle
            className={styles.playerStats}
            subtitle={partyRank || 'N/A'}
            title={strings.th_party_mmr}
          />
        )}
        {mmrEstimate.estimate > 0 && (
          <CardTitle
            className={styles.playerStats}
            subtitle={
              <div
                className={styles.estimatedMMR}
                data-hint={`
                  ${strings.general_standard_deviation}: ${Math.round(mmrEstimate.stdDev)},
                  ${strings.general_matches}: ${mmrEstimate.n}
                `}
              >
                {mmrEstimate.estimate}
              </div>
            }
            title={
              <div>
                {strings.th_estimated_mmr}
                <div
                  className={styles.estimateHelp}
                  data-hint={strings.tooltip_estimated_mmr}
                  data-hint-position="top"
                >
                  <ActionHelp className={styles.icon} />
                </div>
              </div>
            }
          />
        )}
      </div>
      <PlayedWith loggedInId={loggedInId} playerId={playerId} />
    </div>
  );
};

const { number, bool, shape, string } = PropTypes;

PlayerStatsCards.propTypes = {
  loading: bool,
  error: bool,
  partyRank: string,
  soloRank: string,
  mmrEstimate: shape({}),
  wins: number,
  losses: number,
  compact: bool,
};

const mapStateToProps = state => ({
  loading: state.app.player.loading,
  error: state.app.player.error,
  partyRank: state.app.player.data.competitive_rank,
  soloRank: state.app.player.data.solo_competitive_rank,
  mmrEstimate: state.app.player.data.mmr_estimate,
  wins: state.app.playerWinLoss.data.win,
  losses: state.app.playerWinLoss.data.lose,
});

export default connect(mapStateToProps)(PlayerStatsCards);
