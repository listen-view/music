                    import {playMode} from '@/common/js/config'
import {loadSearch, loadPlay, loadFavorite} from '@/common/js/cache'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  disc: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  favoriteList: loadFavorite(),
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: loadPlay()
}
export default state
