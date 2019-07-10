<template>
    <div>
        <PageLoad :loading="!loading"/>
        <div class="main bg post" v-show="loading">
            <div class="post-wrap f_p_c">
                <div class="title">{{ details.title || '' }}</div>
                <div class="from">
                    <span class="date">{{ details.dateWord }}</span>
                    <span class="circle" v-if="details.circle_info">{{ details.circle_info[0].circle_name }}</span>
                </div>
                <div class="line"></div>
                <div class="author-info">
                    <div class="left">
                        <div class="avatar" :style="{backgroundImage: 'url(' + (details.avatar || 'https://img1.famulei.com/active/wx_share/default_avatar.jpg') + ')'}">
                            <img class="sign-icon" src="/static/images/v.png" v-if="details.member_type == '1'" />
                            <img class="sign-icon" src="/static/images/staff.png" v-if="details.member_type == '2'" />
                        </div>
                        <div class="name">{{ details.nickname }}</div>
                        <img class="lz" src="/static/images/lz.png" mode="widthFix" />
                        <div class="rank">Lv.{{ details.rank }}</div>
                    </div>
                    <div class="right" v-if="false">
                        <img class="collect" src="/static/images/collect.png" v-show="true" />
                        <img class="collect" src="/static/images/collect.png" v-show="false" />
                    </div>
                </div>
                <div class="content">
                    <wxParse :content="details.content_html_img" :loading="!details.content_html"/>
                    <div class="not-forward" v-if="details.type == 'text,forward' && details.forward_dynamic.length == 0">
                        <img class="bg-img" src="/static/images/notfound_bg.png" mode="widthFix" />
                        <img class="content-img" src="/static/images/not_found.png" mode="widthFix" />
                    </div>
                </div>

                <!--视频-->
                <div class="video-wrap" v-if="details.video && details.video.length && !(details.question_id && details.question_id != '0')">
                    <div class="v-box" v-show="isShowVideo">
                        <video class="video" :src="details.video[0].video_url_mobile || details.video[0].video_url" :poster="details.video[0].image_url" controls></video>
                    </div>
                    <div class="v-img" v-show="!isShowVideo" :style="{'background-image': 'url(' + details.video[0].image_url +')'}">
                        <img src="/static/images/video_icon.png" />
                    </div>
                </div>

                <!-- 组合菠菜显示-->
                <div class="main-bet-group" v-if="details.bet_group && details.bet_group.length > 0">
                    <div v-for="(item, index) in details.bet_group" :key="index">
                        <div class="list-forward-bet">
                            <div class="forward-bet-left fl">
                                <div class="forward-left-top">
                                    <img class="forward-left-logo" :src=" item.member_avatar ? item.member_avatar : '/static/images/default_avatar.jpg'" />
                                    <p class="forward-left-name">{{ item.member_nickname || '' }}</p>
                                </div>
                                <div class="forward-left-middle">
                                    <div class="forward-left-title">
                                        <p class="bet-right-satus" :class="statusData[item.status].className">{{ statusData[item.status].text }}</p>
                                        <p class="forward-left-name">{{ item.title || '' }}</p>
                                        <p class="forward-left-num">(<span class="forward-left-num-span">{{ item.bet_count || '' }}</span>)</p>
                                    </div>
                                    <div class="forward-left-desc">{{ item.content_list_string || '' }}</div>
                                </div>
                                <div class="forward-left-bottom">
                                    <p class="forward-left-people">{{item.member_count}}人已跟单</p>
                                    <p class="forward-left-time">截止 : {{item.end_time_string}}</p>
                                </div>
                            </div>
                            <div class="forward-bet-right fr">
                                <div class="forward-right-ratio">奖金 x{{item.reward_double}}</div>
                                <div class="forward-right-line"></div>
                                <div class="forward-right-chart" v-show="true">
                                    <div class="charts">
                                        <CircleProgress :toImg="true" :unit="winRate.size" :percent="winRate.percent" canvasId="progressChart" :strokeWidth="winRate.width" strokeColor="#0D8DFC">
                                            <span slot="txt">{{percent * 1000 / 10}}%</span>
                                        </CircleProgress>
                                        <div class="no-data" v-if="item.hit_rate == '0'">数据<br>不足</div>
                                    </div>
                                    <p class="forward-right-chart-desc">近{{ item.hit_num > 20 ? item.hit_num : 20 }}场命中率</p>
                                </div>
                            </div>
                        </div>

                        <div class="group-betting cl" :class="{'group-betting1': item.is_follow == 1}">
                            <div class="group-betting-items fl" v-for="(bet, j) in bet.list" :key="j">
                                <div class="group-betting-top cl">
                                    <p class="betting-top-title fl">{{ bet.title || '' }}</p>
                                    <p class="betting-top-but fr" @tap="dialog_bet_group(bet.bet_id)" v-if="false">详情</p>
                                </div>
                                <div class="group-betting-list cl" :class="[item.status != '0' && item.is_follow == 1 ? bet.bet_item_id == bet.result_item_id ? 'group-betting-list1' : 'group-betting-list2' : '']">
                                    <text class="iconfont icon-checkbox-on icon-select"></text>
                                    <div class="betting-list-left fl">{{ bet.item_name || '' }}</div>
                                    <div class="betting-list-right">
                                        <img :src="item.status != '0' && item.is_follow == 1 ? bet.bg_img : '/static/images/bet/bet_white.png'" />
                                        <span class="odds">赔率 : {{ bet.odds || '' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="group-betting-follow cl">
                            <div class="betting-follow-left fl" v-if="item.is_follow == 1">已跟投</div>
                            <div class="betting-follow-right fr" :class="{'betting-follow-right1': item.status != '0'}" @tap="toGuessBet(item.status)">{{item.status == '0' ? item.is_follow == 1 ? '继续跟投' : '跟投' : '已截止' }}</div>
                        </div>
                    </div>
                </div>

                <!--转发组合菠菜投注显示-->
                <div class="main-bet-group" v-if="details.forward_bet_group && details.forward_bet_group.length > 0">
                    <div v-for="(item, index) in details.forward_bet_group" :key="index">
                        <div class="list-forward-bet">
                            <div class="forward-bet-left fl">
                                <div class="forward-left-top">
                                    <img class="forward-left-logo" :src=" item.member_avatar ? item.member_avatar : '/static/images/default_avatar.jpg'" />
                                    <p class="forward-left-name">{{ item.member_nickname || '' }}</p>
                                </div>
                                <div class="forward-left-middle">
                                    <div class="forward-left-title">
                                        <p class="bet-right-satus" :class="statusData[item.status].className">{{ statusData[item.status].text }}</p>
                                        <p class="forward-left-name">{{ item.title || '' }}</p>
                                        <p class="forward-left-num">(<span class="forward-left-num-span">{{ item.bet_count || '' }}</span>)</p>
                                    </div>
                                    <div class="forward-left-desc">{{ item.content_list_string || '' }}</div>
                                </div>
                                <div class="forward-left-bottom">
                                    <p class="forward-left-people">{{item.member_count}}人已跟单</p>
                                    <p class="forward-left-time">截止 : {{item.end_time_string}}</p>
                                </div>
                            </div>
                            <div class="forward-bet-right fr">
                                <div class="forward-right-ratio">奖金 x{{item.reward_double}}</div>
                                <div class="forward-right-line"></div>
                                <div class="forward-right-chart" v-show="true">
                                    <div class="charts">
                                        <CircleProgress :toImg="true" :unit="winRate.size" :percent="winRate.percent" canvasId="progressLeft" strokeType="round" :strokeWidth="winRate.width" strokeColor="#0D8DFC">
                                            <span slot="txt">{{percent * 1000 / 10}}%</span>
                                        </CircleProgress>
                                        <div class="no-data" v-if="item.hit_rate == '0'">数据<br>不足</div>
                                    </div>
                                    <p class="forward-right-chart-desc">近{{ item.hit_num > 20 ? item.hit_num : 20 }}场命中率</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--投票-->
                <div class="editor-vote-list" v-if="details.vote && details.vote.item">
                    <div class="editor-vote-list-top">
                        <div class="vote-list-left"><img class="vote-img" src="/static/images/vote.png" /> 投票</div>
                        <div class="vote-list-right">已有<span class="vote-list-n">{{details.vote.vote_number_count}}</span>人投票</div>
                    </div>
                    <div class="editor-vote-list-bottom" :class="{end: details.vote.status == '1'}">
                        <div class="editor-vote-items" :class="{selected: item.checked}" v-for="(item, index) in details.vote.item" :key="index" @tap="selectVoteItem(item)">
                            <div class="editor-vote-first cl" :class="{'editor-vote-first1': !item.myVoteStatus}">
                                <div class="editor-vote-first-left fl">{{ index + 1 }}<span class="zhijiao-down"></span></div>
                                <div class="editor-vote-first-right fl">{{ item.item || '' }}</div>
                                <div class="editor-vote-first-score" v-if="details.vote.status == '1' || details.vote.is_vote == '1'">{{ item.percent }}</div>
                                <div class="editor-vote-first-line" :style="{width: item.percent}" v-if="details.vote.status == '1' || details.vote.is_vote == '1'"></div>
                                <div class="editor-vote-first-border"></div>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-num cl">
                        <div class="toggle-num-left fl">{{ details.vote.vote.number == '1' ? '单选' : '多选' }}</div>
                        <div class="toggle-num-right fr">截止时间 : {{ details.vote.vote.add_time_str }}</div>
                    </div>
                    <div class="add-vote-btn cl">
                        <p class="add-vote-button add-vote-button-jiezhi fr" v-if="details.vote.status == '1'">已截止</p>
                        <p class="add-vote-button add-vote-btn1 fr" v-if="details.vote.status != '1' && details.vote.is_vote == '1'">已投票</p>
                        <p class="add-vote-button fr" v-if="details.vote.status != '1' && details.vote.is_vote != '1'" @tap="setVote">投票</p>
                    </div>
                </div>

                <!--红包功能显示-->
                <div class="list-items-redenvolope" v-if="details.redPacket_info && details.redPacket_info.length" @tap="linkRedPacket">
                    <!--<a  href="http://img1.famulei.com/active/redEnvelope/index.html?ssdb_key=<?php echo $redPacket_info[0]['ssdb_key'];?>" target="_blank">-->
                    <div class="items-redenvolope-cont" v-for="(item, index) in details.redPacket_info" :key="index" :style="{'background-image': 'url(https://img1.famulei.com/active/wx_share/post_luckymoney.png)'}">
                        <div class="redenvolope-cont-top cl">
                            <div class="redenvolope-top-left flex fl">
                                <img class="redenvolope-avatar" :src="item.member_avatar ? item.member_avatar : '/static/images/default_avatar.jpg'" />
                                <p class="redenvolope-name">{{ item.member_nickname || '' }}</p>
                            </div>
                            <div class="redenvolope-top-right flex fr">
                                <p class="redenvolope-type" v-if="redEnvolope[item.type]">{{ redEnvolope[item.type].text }}</p>
                                <img class="redenvolope-type-img" v-if="redEnvolope[item.type]" :src="redEnvolope[item.type].img" />
                            </div>
                        </div>
                        <div class="redenvolope-cont-middle">{{ item.desc || '' }}</div>
                    </div>
                    <!--</a>-->
                </div>

                <!--单场菠菜显示投注-->
                <div class="bet-single-wrap" v-if="details.bet_list && details.bet_list.length">
                    <div class="bet-single bet-single-list" v-for="(item, index) in details.bet_list" :key="index">
                        <div class="bet-single-top">
                            <div class="bet-single-match">
                                <img class="single-match-img" :src="item.image" />
                                <div class="single-match-name">{{item.name}}</div>
                                <div class="single-match-status" :class="[singleBetStatus[item.status].className]">{{singleBetStatus[item.status].text}}</div>
                                <div class="go-bet-center flex" v-if="false"><span>菠菜中心</span><text class="iconfont icon-general__arrow_right"></text></div>
                            </div>
                            <div class="bet-single-team cl" v-if="item.view_type == '1'">
                                <div class="single-team-left fl">
                                    <p class="single-team-time font-ib">{{item.match_date1 || ''}}</p>
                                    <p class="single-team-Bo font-ib">{{item.match_date || ''}} BO</p>
                                    <div class="single-team-line"></div>
                                </div>
                                <div class="single-team-middle fl">
                                    <div class="single-team-a fl">
                                        <p class="single-team-a-name font-ib">{{item.match_team_a || ''}}</p>
                                        <img class="single-team-a-logo" :src="item.team_image_thumb_a || '/static/images/score_logo.png'" />
                                    </div>
                                    <div class="single-team-vs font-ib fl">VS</div>
                                    <div class="single-team-b fl">
                                        <img class="single-team-b-logo" :src="item.team_image_thumb_a || '/static/images/score_logo.png'" />
                                        <p class="single-team-b-name font-ib">{{item.match_team_b || ''}}</p>
                                    </div>
                                </div>
                                <div class="single-team-right fr">
                                    <div class="single-team-qianzhan" @tap="toMatchDetail(item.match_id)">前瞻</div>
                                    <div class="single-team-line"></div>
                                </div>
                            </div>
                        </div>
                        <div class="bet-single-vote">
                            <div class="single-vote-top cl">
                                <div class="single-vote-top-title fl"><span v-if="item.match_id && item.match_id != '0'">【 {{item.match_team_a}} vs {{item.match_team_b}} 】</span>{{item.title}}</div>
                            </div>
                            <div class="single-vote-list cl">
                                <div v-for="(bet, n) in (item.items || [])" :key="n" class="single-vote-list-items cl" :class="{'single-vote-list-items2': bet.bet_item_id == bet.result_item_id, 'single-vote-list-items1': bet.is_bet == '1'}">
                                    <text class="iconfont icon-checkbox-on icon-select" v-if="bet.bet_item_id == bet.result_item_id"></text>
                                    <div class="vote-items-left fl">{{ bet.item_name }}</div>
                                    <div class="vote-items-right fr">
                                        <img :src="bet.bet_item_id == bet.result_item_id ? '/static/images/bet/bet_blue.png' : '/static/images/bet/bet_white.png'" />
                                        <div class="odds">赔率：{{ bet.odds }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--转发的贴子-->
                <div class="forward-post-wrap" v-if="details.forward_dynamic && details.forward_dynamic.length">
                    <div class="forward-post cl" v-for="(item, index) in details.forward_dynamic" :key="index" @tap="toDynamicLink(item.dynamic_id)">
                        <div class="img-wrap">
                            <img class="f-img" v-if="item.video[0]" :src="(item.video[0].image_url || '/static/images/default_score.png') + '?x-oss-process=image/resize,m_fill,h_120,w_120,limit_0'" mode="widthFix" />
                            <img class="f-img" v-else :src="(item.picture[0] && item.picture[0].image_url || '/static/images/default_score.png') + '?x-oss-process=image/resize,m_fill,h_120,w_120,limit_0'" mode="widthFix" />
                        </div>
                        <div class="post-conent">
                            <h2>{{ item.title }}</h2>
                            <p>{{ item.summary }}</p>
                            <div class="author flex">
                                <img v-if="item.avatar" :src="(item.avatar || '/images/homepage/player_pic.jpg') + '?x-oss-process=image/resize,m_fill,h_20,w_20,limit_0'" mode="widthFix" />
                                <span>{{ item.nickname }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!--比赛赛事显示-->
                <div class="forward-match-wrap" v-if="details.match_info && details.match_info.length">
                    <div class="list-items-match" v-for="(item, index) in details.match_info" :key="index" @tap="toMatchDetail(item.match_id)">
                        <div class="items-match-top">{{ item.tournament_name }}</div>
                        <div class="items-match-middle cl">
                            <div class="items-match-left fl">
                                <img class="match-left-img" :src="item.team_a_image_thumb" mode="widthFix" />
                                <p class="match-left-name font-ib">{{item.team_a_short_name}}</p>
                            </div>
                            <div class="items-match-cont">
                                <p class="tems-match-cont-vs font-ib" v-if="item.status != '2'">VS</p>
                                <p class="items-match-cont-score font-ib" v-else>{{item.team_a_win}} : {{item.team_b_win}}</p>
                                <p class="items-match-cont-time font-ib">{{item.start_time_string}}</p>
                            </div>
                            <div class="items-match-right fr">
                                <img class="match-left-img" :src="item.team_b_image_thumb" mode="widthFix" />
                                <p class="match-left-name font-ib">{{item.team_b_short_name}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!--普通语音-->
                <div class="audio-wrap" v-if="details.sound && details.sound.length && !(details.question_id && details.question_id != '0')">
                    <AudioBox commentType="details" :cid="details.dynamic_id" :src="details.sound[0].audio_url" :duration="details.sound[0].seconds" :stop="details.audioStop" @setAudioStop="audioStop" />
                </div>

                <!--问答-->
                <QuestionsAndAnswers :details="details" @updateDetails="updateData" @setAudioStop="audioStop" />

            </div>
            <!--优质帖子奖励-->
            <div class="reward" v-if="details.bm_list && details.bm_list.length > 0">
                <div class="reward-title"><img src="/static/images/praise.png" /><span>优质贴子奖励</span></div>
                <ul class="list">
                    <li class="item" v-for="(item, index) in details.bm_list" :key="index">
                        <div class="left"><img src="/static/images/guozi.png" /><span>+{{item.guozi}} by {{item.admin_nickname}}</span></div>
                        <div class="right">{{item.demo}}</div>
                    </li>
                </ul>
            </div>
            <!--工具条-->
            <div class="tools-bar">
                <div class="btn like-btn" :class="{praise: details.is_praise == '1'}" @click="setPraise">
                    <!--<img class="btn-icon" src="/static/images/like.png" />-->
                    <text class="iconfont icon-circle__good_white"></text>
                    <span class="num">{{ details.praise_count > 0 ? details.praise_count : '点赞'}}</span>
                </div>
                <div class="btn comment-btn" @click="dynamicComment"><img class="btn-icon" src="/static/images/comment.png" /><span class="num">{{ details.comment_count > 0 ? details.comment_count : '回复'}}</span>
                </div>
                <button class='btn share-btn' id="shareBtn" open-type="share" type="" hover-class="none"><img class="btn-icon" src="/static/images/share.png" /></button>
            </div>
            <!--神回复-->
            <div class="comment-wrap hots" v-if="hotComment.list.length">
                <div class="c-header">
                    <div class="line"></div>
                    <div class="title">神回复</div>
                    <div class="right" @click="toHotComment"><span>共有</span><span class="count">{{ hotComment.count }}</span><span>条神回复</span><text class="iconfont icon-general__arrow_right"></text></div>
                </div>
                <ul class="c-list">
                    <li class="c-item" v-for="(item, index) in hotComment.list" :key="index">
                        <div class="avatar">
                            <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                            <img class="sign-icon" src="/static/images/v.png" v-if="item.member_type == '1'" />
                            <img class="sign-icon" src="/static/images/staff.png" v-if="item.member_type == '2'" />
                        </div>
                        <div class="comment-info">
                            <div class="c-username"><span>{{ item.nickname || '' }}</span><div class="rank">Lv.{{ item.rank }}</div></div>
                            <div class="content">
                                <div class="text-box">
                                    <wxParse :content="item.content_html_img" :loading="!item.content_html_img"/>
                                </div>
                                <!--图片-->
                                <div class="img-box flex" v-if="item.picture && item.picture.length" :class="[item.picture.length == 1 ? 'one' : item.picture.length == 2 ? 'two' : item.picture.length > 2 ? 'three' : '']">
                                    <div class="pic-wrap" v-for="(pic, p) in item.picture" :key="p" v-if="p < 3">
                                        <img :src="pic.image_url_scale" mode="widthFix" />
                                        <div class="type-label" :class="[pic.imgType == '1' ? 'gif' : pic.imgType == '2' ? 'lang' : '']">{{pic.imgType == '1' ? 'GIF' : pic.imgType == '2' ? '长图' : ''}}</div>
                                    </div>
                                </div>
                                <!--语音-->
                                <AudioBox v-if="item.audio_url" commentType="hotComment" :cid="item.dynamic_comment_id" :src="item.audio_url" :duration="item.seconds" :stop="item.audioStop" @setAudioStop="audioStop" />
                            </div>
                            <ul class="reply-list" :class="{full: item.reply.list.length == item.reply.count}" v-show="item.reply.count > 0">
                                <li class="r-item" v-for="(replyItem, n) in (item.reply.list || [])" :key="n" @click="replyReplyComment(replyItem)">
                                    <span class="r-username">{{ replyItem.nickname || '' }} :</span><wxParse :content="replyItem.content_html_img" :loading="!replyItem.content_html_img"/><span class="r-date">{{replyItem.web_time}}</span>
                                </li>
                            </ul>
                            <div class="more-hot-reply-btn" v-show="item.reply.list.length < item.reply.count" @click="toMoreReply(item.dynamic_comment_id, item.floorStr)">还剩 {{item.reply.count - item.reply.list.length}} 条回复</div>
                            <div class="tools-bar">
                                <div class="left">{{ item.floorStr }}<span class="date">{{ item.web_time || '' }}</span></div>
                                <div class="right">
                                    <button class='btn share-btn' @tap="showShareBox(item)"><img class="btn-icon" src="/static/images/share.png" /></button>
                                    <div class="btn comment-btn" @click="replyComment(item)"><img class="btn-icon" src="/static/images/comment.png" /><span class="num" v-show="item.reply.count > 0">{{ item.reply.count }}</span></div>
                                    <div class="btn like-btn" :class="{praise: item.is_praise == '1'}" @click="setReplyPraise(item)"><text class="iconfont icon-circle__good_white"></text><span class="num" v-if="item.praise_count > 0">{{ item.praise_count }}</span></div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="more" v-if="false">查看更多神回复</div>
            </div>
            <!--全部评论-->
            <div class="comment-wrap">
                <div class="c-header">
                    <div class="line"></div>
                    <div class="title">全部回复</div>
                    <div class="right" @tap="sortType = !sortType"><span class="sort-text">{{ sortType ? '正序' : '倒序' }}</span><img class="sort-img" :class="{desc: !sortType}" src="/static/images/sort_arrow.png" /></div>
                </div>
                <ul class="c-list">
                    <li class="null" v-if="commentList.length === 0">
                        <img src="/static/images/null.png" mode="widthFix" />
                        <div class="text">别让楼主寂寞太久哦</div>
                    </li>
                    <li class="c-item" v-for="(item, index) in commentList" :key="index">
                        <div class="avatar">
                            <img class="avatar-img" :src="item.avatar || '/static/images/default_avatar.jpg'" />
                            <img class="sign-icon" src="/static/images/v.png" v-if="item.member_type == 1" />
                            <img class="sign-icon" src="/static/images/staff.png" v-if="item.member_type == 2" />
                        </div>
                        <div class="comment-info">
                            <div class="c-username"><span>{{ item.nickname || '' }}</span><div class="rank">Lv.{{ item.rank }}</div></div>
                            <div class="content">
                                <div class="text-box">
                                    <wxParse :content="item.content_html_img" :loading="!item.content_html_img"/>
                                </div>
                                <!--图片-->
                                <div class="img-box flex" :class="[item.picture.length == 1 ? 'one' : item.picture.length == 2 ? 'two' : item.picture.length > 2 ? 'three' : '']" v-if="item.picture && item.picture.length">
                                    <div class="pic-wrap" v-for="(pic, p) in item.picture" :key="p" v-if="p < 3">
                                        <img :src="pic.image_url_scale" mode="widthFix" />
                                        <div class="type-label" :class="[pic.imgType == '1' ? 'gif' : pic.imgType == '2' ? 'lang' : '']">{{pic.imgType == '1' ? 'GIF' : pic.imgType == '2' ? '长图' : ''}}</div>
                                    </div>
                                </div>
                                <!--语音-->
                                <AudioBox commentType="comment" :cid="item.dynamic_comment_id" :src="item.audio_url" :duration="item.seconds" :stop="item.audioStop" @setAudioStop="audioStop" />
                            </div>
                            <ul class="reply-list" :class="{full: item.reply.list.length == item.reply.count}" v-show="item.reply.count > 0">
                                <li class="r-item" v-for="(replyItem, n) in (item.reply.list || [])" :key="n" @click="replyReplyComment(replyItem)">
                                    <span class="r-username">{{ replyItem.nickname || '' }} :</span><wxParse :content="replyItem.content_html_img" :loading="!replyItem.content_html_img"/><span class="r-date">{{replyItem.web_time}}</span>
                                </li>
                            </ul>
                            <div class="more-hot-reply-btn" v-show="item.reply.list.length < item.reply.count" @click="toMoreReply(item.dynamic_comment_id, item.floorStr)">还剩 {{item.reply.count - item.reply.list.length}} 条回复</div>
                            <div class="tools-bar">
                                <div class="left">{{ item.floorStr }}<span class="date">{{ item.web_time || ''}}</span></div>
                                <div class="right">
                                    <div class='btn share-btn' @tap="showShareBox(item)"><img class="btn-icon" src="/static/images/share.png" /></div>
                                    <div class="btn comment-btn" @click="replyComment(item)"><img class="btn-icon" src="/static/images/comment.png" /><span class="num" v-show="item.reply.count > 0">{{ item.reply.count }}</span></div>
                                    <div class="btn like-btn" :class="{praise: item.is_praise == 1}" @click="setReplyPraise(item)"><text class="iconfont icon-circle__good_white"></text><span class="num" v-if="item.praise_count > 0">{{ item.praise_count }}</span></div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <Load :loading="bottomLoading" />
            </div>
        </div>
        <ShareComments v-on:update:isShow="shareBox = $event" v-on:update:chart="chartsShow = $event" :isShow="shareBox" ref="show" v-bind="shareContent" />
        <SendCommentBox @updateComment="updateData" ref="clear" :name="nickName" :ctype="commentType" :rid="replyId" :rrid="replyReplyId" :did="did" />
    </div>
</template>

<script>
  import wxParse from 'mpvue-wxparse'
  import Api from '@/http/api'
  import Load from '@/components/Load'
  import PageLoad from '@/components/PageLoad'
  import SendCommentBox from '@/components/SendCommentBox'
  import ShareComments from '@/components/ShareComments'
  import AudioBox from '@/components/AudioBox'
  import QuestionsAndAnswers from '@/components/QuestionsAndAnswers'
  import Moment from 'moment'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import CircleProgress from 'mini-circleprogress'
  import { emojiToImg } from '@/utils/index'

  // Moment.locale('cn')

  export default {
    components: {
      wxParse,
      Load,
      PageLoad,
      SendCommentBox,
      CircleProgress,
      ShareComments,
      AudioBox,
      QuestionsAndAnswers
    },

    data () {
      return {
        loading: false,
        bottomLoading: false,
        did: '', // 416466 432129 432128 432130 432131 432134 432133 421735 432336 432342 432344 980425 432225
        details: {},
        statusData: {
          '0': {
            text: '竞猜中',
            className: 'button_orange'
          },
          '1': {
            text: '已结束',
            className: 'button_blue'
          },
          '2': {
            text: '已关闭',
            className: 'button_gray'
          },
          '3': {
            text: '已截止',
            className: 'button_red'
          }
        },
        singleBetStatus: {
          '1': {
            text: '竞猜中',
            className: 'button_orange'
          },
          '2': {
            text: '已关闭',
            className: 'button_gray'
          },
          '3': {
            text: '已结束',
            className: 'button_blue'
          },
          '4': {
            text: '已结算',
            className: 'button_blue'
          },
          '5': {
            text: '退款中',
            className: 'button_red'
          },
          '6': {
            text: '已截止',
            className: 'button_red'
          },
          '7': {
            text: '已截止',
            className: 'button_red'
          },
          '8': {
            text: '已截止',
            className: 'button_red'
          }
        },
        redEnvolope: {
          '0': {
            img: '',
            text: ''
          },
          '1': {
            img: '/static/images/icon_pin.png',
            text: '拼手气红包'
          },
          '2': {
            img: '/static/images/icon_putong.png',
            text: '普通红包'
          },
          '3': {
            img: '/static/images/icon_ling.png',
            text: '口令红包'
          }
        },
        comment: {
          count: 0,
          list: []
        },
        hotComment: {
          count: 0,
          list: []
        },
        commentLastPageKey: '',
        nickName: '楼主',
        commentType: 0,
        replyId: '',
        replyReplyId: '',
        sortType: true, // true: 正序 false: 倒序
        percent: Math.random() / 100,
        winRate: {
          size: 220,
          width: 8,
          percent: Math.random() / 100
        },
        shareBox: false,
        shareContent: {
          avatar: '',
          name: '',
          title: '',
          content: '',
          circle: '',
          memberType: ''
        },
        bet: {
          id: '',
          list: []
        },
        vote: {
          selectList: [],
          activeItem: null
        },
        chartsShow: true,
        currAudioId: '', // 存储当前音频播放ID
        currAudioFromComment: '' // 当前播放音频所属数组
      }
    },
    computed: {
      ...mapState(['member', 'isShowVideo', 'isLogin', 'isShowAuthSetModal']),
      commentList () {
        let list = [].concat(this.comment.list)
        return this.sortType ? list : list.reverse()
      }
    },
    onShareAppMessage (ops) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        // console.log(ops.target)
      }
      return {
        title: this.details.title || 'score',
        path: '/pages/news/detail/main?did=' + this.did,
        success: function (res) {
          // 转发成功
          // console.log('转发成功:' + JSON.stringify(res))
        },
        fail: function (res) {
          // 转发失败
          // console.log('转发失败:' + JSON.stringify(res))
        }
      }
    },
    methods: {
      ...mapMutations(['setShowVideo', 'setShowAuthSetModal', 'setShowClubTestModal']),
      ...mapActions(['toMatchDetail']),
      init () {
        this.loading = false
        this.bottomLoading = false
        this.details = {}
        this.comment.count = 0
        this.comment.list = []
        this.hotComment.count = 0
        this.hotComment.list = []
        this.commentLastPageKey = ''
        this.nickName = '楼主'
        this.commentType = 0
        this.replyId = ''
        this.replyReplyId = ''
        this.sortType = true
        this.percent = Math.random() / 100
        this.winRate.percent = Math.random() / 100
        this.shareBox = false
        this.shareContent.avatar = ''
        this.shareContent.name = ''
        this.shareContent.title = ''
        this.shareContent.content = ''
        this.shareContent.circle = ''
        this.shareContent.memberType = ''
        this.bet.id = ''
        this.bet.list = []
        this.vote.selectItems = []
        this.vote.activeItem = null
        this.chartsShow = true
        this.currAudioId = ''
        this.currAudioFromComment = ''
      },
      // 停止当前语音播放
      audioStop (obj) {
        // console.log(obj)
        this.currAudioFromComment = obj.type
        if (!this.currAudioId) {
          this.currAudioId = obj.cid
        } else {
          if (this.currAudioId !== obj.cid) {
            this.setAudioStatus(obj.type)
            this.currAudioId = obj.cid
          }
        }
      },
      // 设置当前语音播放状态
      setAudioStatus (type) {
        console.log(type)
        if (type == 'details') {
          this.$set(this.details, 'audioStop', true)
        } else {
          this[type].list.forEach((item) => {
            if (item.dynamic_comment_id === this.currAudioId) {
              item.audioStop = true
            } else {
              item.audioStop = false
            }
          })
        }
      },
      // 文章详情
      async getPostDetail () {
        let params = {
          dynamic_id: this.did,
          member_id: this.member.member_id || '',
          token: this.member.f_token || ''
        }
        return Api.ajax('GET', '/services/dynamic/dynamic_info.php', params).then(resp => {
          if (resp.code === '200') {
            let data = resp.data || {}
            let list = data.hot_dynamic_comment_list || []
            this.shareContent.title = data.title || ''
            this.shareContent.circle = data.circle_info[0].circle_name || ''
            list.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              let floor = parseInt(item.floor)
              item.floorStr = floor === 1 ? '沙发' : floor === 2 ? '地板' : floor + 1 + '楼'
              item.reply.list.forEach(subItem => {
                subItem.web_time = Moment.unix(subItem.add_time).fromNow()
              })
            })
            // 表情符转换成图片
            data.content_html_img = emojiToImg(data.content_html)
            // 组合菠菜
            if (data.bet_group && data.bet_group.length > 0) {
              this.winRate.percent = parseFloat(data.bet_group[0].hit_rate) / 100
            }
            // 转发的组合菠菜
            if (data.forward_bet_group && data.forward_bet_group.length > 0) {
              this.winRate.percent = parseFloat(data.forward_bet_group[0].hit_rate) / 100
            }
            // 投票
            if (data.vote && data.vote.item) {
              data.vote.item.forEach((item) => {
                if (data.vote.my_vote) {
                  data.vote.my_vote.forEach((myItem) => {
                    if (item.item_id === myItem.item_id) {
                      item.myVoteStatus = true
                    }
                  })
                }
              })
            }
            if (data.vote.vote) {
              data.vote.vote.add_time_str = Moment.unix(data.vote.vote.end_time, 'x').format('YYYY-MM-DD HH:mm:ss')
            }
            this.details = data
          }
        }).catch(() => {})
      },
      // 全部评论
      async getComment (isReply) {
        if (isReply) {
          this.commentLastPageKey = ''
        }
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          dynamic_id: this.did,
          limit: 20,
          last_page_key: this.commentLastPageKey
        }
        return Api.ajax('GET', '/services/dynamic/dynamic_comment_list.php', params).then(resp => {
          if (resp.code === '200') {
            let data = resp.data || {}
            let list = data.list || []
            let hotList = data.hot_comment_list.list || []
            let len = list.length
            if (isReply) {
              this.comment.list = []
              this.hotComment.list = []
            }
            list.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              let floor = parseInt(item.floor)
              item.floorStr = floor === 1 ? '沙发' : floor === 2 ? '地板' : floor + 1 + '楼'
              item.reply.list.forEach(subItem => {
                subItem.web_time = Moment.unix(subItem.add_time).fromNow()
                // 表情符转换成图片
                subItem.content_html_img = emojiToImg(subItem.content)
              })
              // 表情符转换成图片
              item.content_html_img = emojiToImg(item.content)
              // 语音控制
              item.audioStop = false
              // 增加图片数据
              if (item.picture && item.picture.length) {
                item.picture.forEach(pic => {
                  // 0:普通 1:GIF 2:长图
                  pic.imgType = ''
                  if (pic.image_url) {
                    if (item.picture.length === 1) {
                      pic.image_url_scale = pic.image_url + '?x-oss-process=image/resize,m_fill,w_600,h_376,limit_0'
                    } else {
                      pic.image_url_scale = pic.image_url + '?x-oss-process=image/resize,m_fill,w_500,h_500,limit_0'
                    }

                    if (pic.image_url.lastIndexOf('.gif') !== -1) {
                      pic.imgType = '1'
                      pic.image_url_scale += '/format,jpg'
                    } else if (parseInt(pic.height) > 0 && parseInt(pic.width) * 2 <= parseInt(pic.height)) {
                      pic.imgType = '2'
                    } else {
                      pic.imgType = '0'
                    }
                  }
                })
              }
              this.comment.list.push(item)
            })

            hotList.forEach(item => {
              item.web_time = Moment.unix(item.add_time).fromNow()
              let floor = parseInt(item.floor)
              item.floorStr = floor === 1 ? '沙发' : floor === 2 ? '地板' : floor + 1 + '楼'
              item.reply.list.forEach(subItem => {
                subItem.web_time = Moment.unix(subItem.add_time).fromNow()
                // 表情符转换成图片
                subItem.content_html_img = emojiToImg(subItem.content)
              })
              // 表情符转换成图片
              item.content_html_img = emojiToImg(item.content)
              // 语音控制
              item.audioStop = false
              // 增加图片数据
              if (item.picture && item.picture.length) {
                item.picture.forEach(pic => {
                  // 0:普通 1:GIF 2:长图
                  pic.imgType = ''
                  if (pic.image_url) {
                    if (item.picture.length === 1) {
                      pic.image_url_scale = pic.image_url + '?x-oss-process=image/resize,m_fill,w_600,h_376,limit_0'
                    } else {
                      pic.image_url_scale = pic.image_url + '?x-oss-process=image/resize,m_fill,w_500,h_500,limit_0'
                    }

                    if (pic.image_url.lastIndexOf('.gif') !== -1) {
                      pic.imgType = '1'
                      pic.image_url_scale += '/format,jpg'
                    } else if (parseInt(pic.height) > 0 && parseInt(pic.width) * 2 <= parseInt(pic.height)) {
                      pic.imgType = '2'
                    } else {
                      pic.imgType = '0'
                    }
                  }
                })
              }
              this.hotComment.list.push(item)
            })

            this.comment.count = data.count || 0
            this.hotComment.count = data.count || 0

            if (list.length) {
              this.commentLastPageKey = list[len - 1].cache_key || ''
            }
          }
        })
      },
      // 组合菠菜
      async getBet () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          bet_group_id: this.bet.id
        }
        return Api.ajax('GET', '/services/bet/group_bet_info.php', params).then(resp => {
          if (resp.code === '200') {
            let list = resp.data.bet_items || []
            list.forEach((item) => {
              if (item.bet_item_id === item.result_item_id) {
                item.bg_img = '/static/images/bet/bet_blue.png'
              } else {
                item.bg_img = '/static/images/bet/bet_red.png'
              }
            })
            this.bet.list = list
          }
        })
      },
      // 点赞
      setPraise () {
        if (!this.isLogin) {
          this.setShowAuthSetModal(1)
          this.setShowVideo(0)
        } else {
          let params = {
            member_id: this.member.member_id || '',
            token: this.member.f_token || '',
            dynamic_id: this.did
          }
          Api.ajax('POST', '/services/dynamic/dynamic_praise.php', params).then(resp => {
            if (resp.code === '200') {
              this.details.is_praise = '1'
              this.details.praise_count++
            }
            wx.showToast({
              title: resp.message,
              duration: 800,
              mask: true
            })
          })
        }
      },
      // 楼层点赞
      setReplyPraise (item) {
        if (!this.isLogin) {
          this.setShowAuthSetModal(1)
          this.setShowVideo(0)
        } else {
          let params = {
            member_id: this.member.member_id || '',
            token: this.member.f_token || '',
            dynamic_id: this.did,
            dynamic_comment_id: item.dynamic_comment_id,
            comment_cache_key: item.cache_key
          }
          Api.ajax('GET', '/services/dynamic/dynamic_comment_praise.php', params).then(resp => {
            if (resp.code === '200') {
              this.getComment(1)
            }
            wx.showToast({
              title: resp.message,
              duration: 800,
              mask: true
            })
          })
        }
      },
      // 投票
      setVote () {
        let params = {
          member_id: this.member.member_id || '',
          token: this.member.f_token || '',
          dynamic_id: this.did,
          itemId_string: this.vote.selectList.join(',')
        }
        Api.ajax('GET', '/services/dynamic/vote_add.php', params).then(resp => {
          if (resp.code === '200') {
            this.$set(this.details.vote, 'is_vote', '1')
            setTimeout(() => {
              this.getPostDetail()
            }, 200)
          }
          wx.showToast({
            title: resp.message,
            duration: 800,
            mask: true
          })
        })
      },
      // 选择投票项
      selectVoteItem (item) {
        let type = this.details.vote.vote && this.details.vote.vote.number
        let status = this.details.vote.status
        let isVote = this.details.vote.is_vote
        if ((status != '0') || (isVote == '1') || (type == '0')) return
        if (item.checked) {
          if (type > 1) {
            item.checked = false
            this.vote.selectList.forEach((val, index) => {
              if (item.item_id == val) {
                this.vote.selectList.splice(index, 1)
              }
            })
          }
        } else {
          if (type == '1') {
            this.$set(item, 'checked', true)
            this.vote.selectList.shift()
            this.vote.selectList.push(item.item_id)
            if (this.vote.activeItem) {
              this.$set(this.vote.activeItem, 'checked', false)
            }
            this.vote.activeItem = item
          } else {
            if (this.vote.selectList.length < type) {
              this.$set(item, 'checked', true)
              this.vote.selectList.push(item.item_id)
            } else {
              wx.showToast({title: '最多选择' + type + '项', duration: 500, mask: true})
            }
          }
        }
      },
      // 更新数据
      updateData () {
        this.getPostDetail()
        this.getComment(1)
      },
      // 回复楼主
      dynamicComment () {
        this.nickName = '楼主'
        this.commentType = 1
        this.replyId = ''
        this.replyReplyId = ''
      },
      // 回复楼层
      replyComment (item) {
        this.commentType = 2
        this.nickName = item.nickname
        this.replyId = item.dynamic_comment_id
        this.replyReplyId = ''
        this.$refs.clear.controlCommentBox()
      },
      // 楼层回复的回复
      replyReplyComment (item) {
        this.commentType = 3
        this.nickName = item.nickname
        this.replyId = item.bar_comment_id
        this.replyReplyId = item.dynamic_comment_id
        this.$refs.clear.controlCommentBox()
      },
      // 评论分享
      showShareBox (item) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.shareContent.avatar = item.avatar || 'https://img1.famulei.com/active/wx_share/default_avatar.jpg'
        this.shareContent.name = item.nickname
        this.shareContent.content = item.content
        this.shareContent.memberType = item.member_type || ''
        this.shareBox = true
        // this.chartsShow = false
        // this.$refs.show.setCanvas()
      },
      // 跳转热评页
      toHotComment () {
        let did = this.did
        this.$router.push({path: '/pages/news/hotComment/main', query: { did }})
      },
      // 跳转更多回复页
      toMoreReply (dcid, floor) {
        let did = dcid
        this.$router.push({path: '/pages/news/replyComment/main', query: { did, floor }})
      },
      // 跳转帖子详情页
      toDynamicLink (did, betId) {
        let betid = betId || ''
        if (did) {
          this.$router.push({ path: '/pages/news/detail/main', query: {did, betid} })
        }
      },
      // 打开红包页
      linkRedPacket () {
        let url = 'http://img1.famulei.com/active/redEnvelope/index.html'
        let redKey = this.details.redPacket_ssdb_key
        this.$router.push({path: '/pages/match/data/main', query: { url, redKey }})
      },
      // 跳转到组合菠菜投注页
      toGuessBet (status) {
        let betId = this.bet.id
        this.$router.push({path: '/pages/betGroup/main', query: { betId }})
        if (status === '0') {
          if (!this.isLogin) {
            this.setShowAuthSetModal(1)
            this.setShowVideo(0)
          } else {
          }
        }
      },
      preview (src, e) {
        // do something
      },
      navigate (href, e) {
        // do something
        console.log(href)
        console.log(e)
      }
    },
    async mounted () {
      this.setShowVideo(1)
      await this.getPostDetail()
      // this.bet.id = '2220' // 2219 7657
      if (this.bet.id) {
        await this.getBet()
      }
      await this.getComment()
      this.loading = true
    },
    onLoad (e) { // query需要在onLoad周期内获取
      this.init()
      const dynamicId = e.scene ? decodeURIComponent(e.scene) : ''
      this.did = dynamicId || e.did || this.$route.query.did
      this.bet.id = e.betid || this.$route.query.betid
    },
    onUnload () {
      if (this.currAudioFromComment) {
        this.setAudioStatus(this.currAudioFromComment)
      }
      this.$refs.clear.controlCommentBox()
      this.setShowClubTestModal(0)
    },
    async onPullDownRefresh () {
      this.setShowVideo(1)
      await this.getPostDetail()
      if (this.bet.id) {
        await this.getBet()
      }
      await this.getComment(1)
      wx.stopPullDownRefresh()
    },
    // 上拉加载
    async onReachBottom () {
      if (!this.bottomLoading) {
        this.bottomLoading = true
        await this.getComment()
        this.bottomLoading = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
    @import url("~mpvue-wxparse/src/wxParse.css")
    .post-wrap {
        padding 20rpx 28rpx
        /*border-top 2rpx solid #F0F1F2*/
        background-color #fff
        .title {
            font-size 22px
            font-weight 600
            line-height 30px
            text-align justify
            font-family 'PingFangSC-Semibold', 'Microsoft Yahei', sans-serif
        }
        .from {
            height 32rpx
            line-height 32rpx
            font-size 24rpx
            font-weight 400
            color #A8ABB3
            margin-top 16rpx
            overflow hidden
            .circle {
                float right
            }
        }
        .line {
            width 100%
            height 2rpx
            background-color #F0F1F2
            margin-top 20rpx
        }
        .author-info {
            margin-top 30rpx
            display -webkit-flex
            display flex
            justify-content space-between
            .left {
                float left
                display -webkit-flex
                display flex
                align-items center
            }
            .right {
                width 48rpx
                height 48rpx
                .collect {
                    width: 100%
                    height: 100%
                }
            }
            .avatar {
                width 48rpx
                height 48rpx
                background-repeat no-repeat
                background-position center
                background-size cover
                position relative
                border-radius 50%

                .sign-icon {
                    width 30rpx
                    height 30rpx
                    position absolute
                    right -8rpx
                    bottom -8rpx
                }
            }
            .name {
                height 40rpx
                line-height 40rpx
                font-size 28rpx
                font-weight 600
                margin-left 18rpx
            }
            .lz {
                width 52rpx
                margin-left 12rpx
            }
            .rank {
                width 68rpx
                height 28rpx
                line-height 28rpx
                background linear-gradient(135deg,rgba(25,167,255,1) 0%,rgba(5,138,255,1) 100%)
                border-radius 6rpx
                text-align center
                font-size 22rpx
                color #fff
                margin-left 12rpx
            }
        }
        .content {
            padding 10rpx 0

            .not-forward {
                width 100%
                height 145rpx
                position relative
                margin-top 10px
                .bg-img {
                    width 100%
                    position absolute
                }
                .content-img {
                    width 50%
                    left 25%
                    top 20rpx
                    display block
                    position absolute
                    z-index 2
                }
            }
        }
        .charts {
            width 220rpx
            height 220rpx
            position relative
            .no-data {
                position: absolute;
                top calc(50% - 36rpx)
                left 30%
                line-height: 36rpx;
                width: 40%;
                margin: 0;
                padding: 0;
                font-size: 28rpx;
                color: #ff5c69;
                font-weight: bold;
                background #fff
                text-align center
                z-index 1
            }
        }
        /*状态标签*/
        .bet-right-satus {
            vertical-align: middle;
            width: 100rpx
            text-align: center
            line-height: 34rpx
            height: 34rpx
            display: inline-block
            font-size: 24rpx;
            color: #FFF;
            background: #0D8DFC;
            border-radius: 8rpx;
            &.button_orange {
                background #ffde79
            }
            &.button_blue {
                background #4a90e2
            }
            &.button_gray {
                background #A8ABB3
            }
            &.button_red {
                background #ff5c5c
            }
        }
        /*组合菠菜投注显示*/
        .main-bet-group{
            margin-top: 20rpx
            background: #FFFFFF;
            box-shadow: 0 0 0 2rpx #EBEBED;
            border-radius: 4rpx;
            .list-forward-bet {
                box-shadow:0 6rpx 12rpx 0 rgba(0,0,0,0.04);
                border-bottom 2rpx solid #F0F1F2
                height: 312rpx
                .forward-bet-left{
                    margin-left: 24rpx
                    width 60%
                    .forward-left-top{
                        padding-top: 20rpx
                        display -webkit-flex
                        display flex
                        align-items center
                        .forward-left-logo{
                            height: 40rpx
                            width: 40rpx
                            border-radius:50%
                        }
                        .forward-left-name{
                            margin-left: 16rpx
                            font-size: 28rpx;
                            color: #A8ABB3;
                        }
                    }
                    .forward-left-middle{
                        margin-top: 24rpx
                        .forward-left-title{
                            display -webkit-flex
                            display flex
                            align-items center
                            .forward-left-name{
                                margin-left: 10rpx
                                font-size: 32rpx;
                                color: #2D2F33;
                                font-weight:bold;
                                max-width:48%
                                overflow: hidden
                                white-space:nowrap
                                text-overflow: ellipsis;
                            }
                            .forward-left-num{
                                margin-left: 12rpx
                                font-size: 32rpx;
                                color: #656973;
                                .forward-left-num-span{
                                    padding:0 4rpx
                                }
                            }
                        }
                        .forward-left-desc{
                            margin-top: 24rpx
                            width: 95%
                            font-size: 28rpx;
                            color: #656973;
                            line-height: 42rpx;
                            height:84rpx
                            overflow: hidden
                        }
                    }
                    .forward-left-bottom{
                        margin-top: 22rpx
                        display -webkit-flex
                        display flex
                        align-items center
                        .forward-left-people{
                            font-size: 24rpx;
                            color: #A8ABB3;
                        }
                        .forward-left-time{
                            margin-left: 10rpx
                            font-size: 24rpx;
                            color: #A8ABB3;
                        }
                    }
                }
                .forward-bet-right{
                    width: 34%
                    position: relative
                    .forward-right-ratio{
                        width: 124rpx
                        height: 42rpx
                        line-height: 42rpx
                        position: absolute
                        top:0
                        right:0
                        background-image: linear-gradient(225deg, #F7DD99 0%, #F0CC84 100%);
                        border-radius: 0 0 0 8rpx;
                        font-size: 24rpx;
                        color: #FFFFFF;
                        text-align: center;
                    }
                    .forward-right-line{
                        position: absolute
                        left:0
                        top: 76rpx
                        height: 160rpx
                        width: 2rpx
                        background: #F0F1F2;
                    }
                    .forward-right-chart{
                        margin-top: 50rpx
                        margin-left: 5%
                        width: 220rpx
                        .forward-right-chart-desc{
                            line-height: 34rpx
                            margin-top: -12rpx
                            font-size: 24rpx;
                            color: #A8ABB3;
                            text-align: center;
                        }
                    }
                }
            }

            .group-betting{
                .group-betting-items{
                    height: 156rpx
                    width: 100%
                    border-top:0 solid #F0F1F2;
                    .group-betting-top{
                        margin: 20rpx 52rpx 0 48rpx
                        .betting-top-title{
                            font-size: 28rpx;
                            color: #2D2F33;
                            font-weight:bold
                        }
                        .betting-top-but{
                            cursor: pointer;
                            font-size: 24rpx;
                            color: #A8ABB3;
                        }
                    }
                    .group-betting-list{
                        margin 12rpx 40rpx 0
                        background: #FFFFFF;
                        height: 68rpx
                        border: 2rpx solid #EBEBED;
                        border-radius: 48rpx;
                        position: relative;
                        .icon-checkbox-on {
                            color #0D8DFC
                        }
                        .icon-select{
                            display: none
                            position: absolute
                            height 32rpx
                            width: 32rpx
                            top: 16rpx
                            left:28rpx
                        }
                        .betting-list-left{
                            margin-left 36rpx
                            line-height:64rpx
                            font-size: 28rpx;
                            color: #2D2F33;
                        }
                        .betting-list-right{
                            position: absolute
                            top:-1rpx
                            right -2rpx
                            width: 216rpx
                            font-size: 28rpx;
                            color: #656973;
                            height: 68rpx
                            line-height:68rpx
                            text-align: center
                            /*background: url("/static/images/bet/bet_white.png") no-repeat;*/
                            /*background-size: cover*/
                            /*background-repeat no-repeat*/
                            /*background-position center*/
                            img {
                                width 100%
                                height 100%
                                display block
                                position absolute
                            }
                            .odds {
                                display block
                                height 100%
                                position absolute
                                left 44rpx
                                z-index 2
                            }
                        }
                    }
                    .group-betting-list1{
                        background: #0D8DFC;
                        border: 2rpx solid rgba(0,0,0,0.04);
                        border-radius: 48rpx;
                        .betting-list-left{
                            margin-left 36rpx
                            line-height:64rpx
                            font-size: 28rpx;
                            color: #fff;
                        }
                        .betting-list-right{
                            position: absolute
                            top:-1rpx
                            right -2rpx
                            width: 216rpx
                            font-size: 28rpx;
                            color: #fff;
                            height: 68rpx
                            line-height:68rpx
                            text-align: center
                            // background: url('/static/images/bet/bet_blue.png') no-repeat;
                            /*background-size: cover*/
                            /*background-repeat no-repeat*/
                            /*background-position center*/
                        }
                    }
                    .group-betting-list2{
                        background: #FF5C69;
                        border: 2rpx solid rgba(0,0,0,0.04);
                        border-radius: 48rpx;
                        .betting-list-left{
                            margin-left 36rpx
                            line-height:64rpx
                            font-size: 28rpx;
                            color: #fff;
                        }
                        .betting-list-right{
                            position: absolute
                            top:-1rpx
                            right -4rpx
                            width: 216rpx
                            font-size: 28rpx;
                            color: #fff;
                            height: 68rpx
                            line-height:68rpx
                            text-align: center
                            // background: url('/static/images/bet/bet_red.png') no-repeat;
                            /*background-size: cover*/
                            /*background-repeat no-repeat*/
                            /*background-position center*/
                        }
                    }
                }
                .group-betting-items:nth-child(2n+1){
                    border-right:0 solid  #F0F1F2;
                }
                .group-betting-items:nth-child(1){
                    border-top:0 solid  #F0F1F2;
                }
                .group-betting-items:nth-child(0){
                    border-top:0 solid  #F0F1F2;
                }
            }
            .group-betting1{
                .group-betting-items{
                    .group-betting-list{
                        .icon-select{
                            display: block
                        }
                        .betting-list-left{
                            margin-left 72rpx
                        }
                    }

                }
            }
            /*选中样式截止*/
            /*投注一结束样式*/
            .group-betting2{}
            /*投注一结束样式截止*/
            .group-betting-follow{
                height:110rpx
                border-top:2rpx solid  #F0F1F2;
                .betting-follow-left{
                    margin 34rpx 0 0 48rpx
                    font-size: 28rpx;
                    color: #656973;
                }
                .betting-follow-right{
                    cursor: pointer
                    margin: 20rpx 40rpx 0 0
                    width: 240rpx
                    height: 68rpx
                    line-height: 68rpx
                    text-align: center
                    background: #0D8DFC;
                    font-size: 28rpx;
                    color: #FFFFFF;
                    border-radius: 48rpx;
                }
                .betting-follow-right1{
                    margin: 20rpx 40rpx 0 0
                    width: 240rpx
                    height: 68rpx
                    line-height: 64rpx
                    text-align: center
                    border: 2rpx solid #EBEBED;
                    border-radius: 34rpx;
                    font-size: 28rpx;
                    color: #A8ABB3;
                    background: transparent
                }
            }
            /* 跟投下面的按钮截止*/
        }
        /*投票样式新加*/
        .editor-vote-list{
            padding 14px 20px 20px
            margin:10px 0 0
            box-shadow: 0 0 0 1px #EBEBED;
            border-radius: 2px;
            .editor-vote-list-top{
                display -webkit-flex
                display flex
                align-items flex-end
                justify-content space-between
                padding-bottom 4px
                .vote-list-left{
                    display -webkit-flex
                    display flex
                    align-items center
                    font-size: 16px;
                    color: #2D2F33;
                    font-weight:bold
                    .vote-img {
                        width 32rpx
                        height 32rpx
                        margin-right 10rpx
                    }
                }
                .vote-list-right{
                    font-size 14px;
                }
            }
            .editor-vote-list-bottom{
                .editor-vote-items{
                    .editor-vote-first{
                        cursor: pointer;
                        margin-top: 10px
                        background: #F7F8FA;
                        border-radius: 4px;
                        height: 44px
                        line-height: 44px
                        position: relative
                        .editor-vote-first-score{
                            position: absolute
                            font-size: 14px;
                            color: #656973;
                            right: 14px
                            top:0px
                        }
                        .editor-vote-first-border{
                            display: none
                            position: absolute
                            top:0px
                            left:0
                            width:100%
                            height: 44px
                            border: 2px solid #0D8DFC;
                            border-radius: 4px;
                            z-index:0
                        }
                        .editor-vote-first-line{
                            position: absolute
                            background: #0D8DFC;
                            border-radius: 0 8px;
                            height 4px
                            left: 0px
                            bottom:0px
                        }
                        .editor-vote-first-left{
                            border-radius:4px 0 0 4px
                            background: #0D8DFC;
                        // display: inline-block
                            width: 40px
                            padding-left 13px
                            font-size: 14px;
                            color: #FFFFFF;
                            position: relative
                            .zhijiao-down{
                                position: absolute
                                top:0
                                right:0
                                width:0
                                height:0
                                border-color:   transparent #F7F8FA
                                border-width: 0 10px 44px 0;
                                border-style: solid;
                            }
                        }
                        .editor-vote-first-right{
                            width 60%
                            overflow hidden
                            white-space nowrap
                            text-overflow ellipsis
                            font-weight bold
                        //display: inline-block
                            margin-left: 12px
                            line-height: 44px
                            font-size: 14px;
                            color: #656973;
                        }
                    }

                    .editor-vote-first1{
                        .editor-vote-first-left{
                            background: #D2D4D9;
                        }
                        .editor-vote-first-line{
                            background: #D2D4D9;
                        }
                    }
                    .editor-vote-first2{
                        .editor-vote-first-border{
                            display: block
                        }
                    }
                }
                .selected {
                    .editor-vote-first{
                        .editor-vote-first-border {
                            display: block
                        }
                    }
                }
            }
            .toggle-num{
                margin-top: 10px
                .toggle-num-left{
                    font-size: 12px;
                    color: #A8ABB3;
                }
                .toggle-num-right{
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
            .add-vote-btn{
                margin-top:23px
                .add-vote-button{
                    cursor: pointer;
                    width: 120px
                    height: 34px
                    border: 1px solid #0D8DFC;
                    border-radius: 24px;
                    line-height 32px
                    text-align: center
                    font-size: 14px;
                    color: #0D8DFC;
                }
                .add-vote-btn1{
                    cursor: auto;
                    border-radius: 24px;
                    line-height 32px
                    text-align: center
                    font-size: 14px;
                    color: #FFFFFF;
                    background: #0D8DFC;
                }
                .add-vote-button-jiezhi{
                    border: 1px solid #EBEBED;
                    border-radius: 20px;
                    background: #fff
                    font-size: 13px;
                    color: #656973;
                }
            }
        }
        /*红包样式*/
        .list-items-redenvolope{
            margin-top: 10px
            .items-redenvolope-cont{
                width: 100%
                height:140px
                background-repeat no-repeat
                background-size:100% 100%
                background-position center
                .redenvolope-cont-top{
                    .redenvolope-top-left{
                        margin:11px 0 0 12px
                        .redenvolope-avatar{
                            height: 32px
                            width: 32px
                            border-radius:50%
                            background: #FFFFFF;
                            border: 2px solid #FFDD8D;
                        }
                        .redenvolope-name{
                            margin-left: 5px
                            display: inline-block
                            font-size: 14px;
                            color: #FFDD8D;
                            line-height 32px
                        }
                    }
                    .redenvolope-top-right{
                        margin:17px 14px 0 0
                        .redenvolope-type{
                            display: inline-block
                            font-size: 14px;
                            color: #FFFFFF;
                            margin-right: 3px
                        }
                        .redenvolope-type-img{
                            height: 18px
                            width: 18px
                            border-radius: 4px;
                        }
                    }
                }
                .redenvolope-cont-middle{
                    margin: 40px 0 0 0
                    font-size: 16px;
                    color: #FFDD8D;
                    text-align: center
                }
            }
        }

        /*单场菠菜显示*/
        .bet-single{
            background: #FFFFFF;
            box-shadow: 0 0 0 1px #EBEBED;
            border-radius: 2px;
            .bet-single-top{
                margin-top: 20px

                .bet-single-match{
                    background: #FAFAFA;
                    height: 38px
                    position relative
                    .go-bet-center{
                        cursor: pointer;
                        position absolute
                        top 9px
                        right 10px
                        font-size 13px
                        align-items center
                        color: #A8ABB3;
                        .icon-general__arrow_right {
                            margin-left 2px
                            margin-top 2px
                            font-size: 13px;
                            color: #A8ABB3;
                        }
                    }
                    .single-match-img{
                        margin 7px 0 0 14px
                        vertical-align middle
                        height 24px
                        width:24px
                    }
                    .single-match-name{
                        display: inline-block
                        vertical-align middle
                        margin 7px 0 0 5px
                        font-size: 14px;
                        color: #2D2F33;
                        font-weight:bold
                        line-height 20px
                    }
                    .single-match-status{
                        margin 7px 0 0 5px
                        vertical-align middle
                        display: inline-block
                        width: 50px
                        height 18px
                        line-height 18px
                        text-align:center
                        font-size: 12px;
                        color: #FFFFFF;
                        border-radius: 4px;
                        &.button_orange {
                            background #0D8DFC
                        }
                        &.button_blue {
                            background #16DE9B
                        }
                        &.button_gray {
                            background #A8ABB3
                        }
                        &.button_red {
                            background #FF5C69
                        }
                    }
                }
                .bet-single-team{
                    display none
                    height 72px
                    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.04);
                    border-bottom 1px solid rgba(240,241,242,1)
                    .single-team-left{
                        width:150px
                        margin-top 17px
                        position: relative;
                        .single-team-line{
                            position: absolute
                            top: 0
                            right 0
                            height 36px
                            width: 1px
                            background: #F0F1F2;
                        }
                        .single-team-time{
                            font-size: 16px;
                            color: #2D2F33;
                            text-align center
                        }
                        .single-team-Bo{
                            margin-top 2px
                            font-size: 12px;
                            color: #A8ABB3;
                            text-align center
                        }
                    }
                    .single-team-middle{
                        .single-team-a{
                            width:132px
                            text-align: center
                            margin-top 16px
                            .single-team-a-name{
                                vertical-align middle
                                display: inline-block
                                font-size: 16px;
                                color: #2D2F33;
                            }
                            .single-team-a-logo{
                                vertical-align middle
                                margin-left 7px
                                height: 40px
                                width: 40px
                            }
                        }
                        .single-team-vs{
                            margin-top 22px
                            height 28px
                            width: 28px
                            background: rgba(0,0,0,0.04);
                            border-radius:50%
                            text-align: center
                            line-height:28px
                            font-size: 13px;
                            color: #656973;
                        }
                        .single-team-b{
                            width:138px
                            text-align: center
                            margin-top 16px
                            .single-team-b-name{
                                vertical-align middle
                                display: inline-block
                                font-size: 16px;
                                color: #2D2F33;
                                margin-left 7px
                            }
                            .single-team-b-logo{
                                vertical-align middle
                                height: 40px
                                width: 40px
                            }
                        }
                    }
                    .single-team-right{
                        width:140px
                        position: relative;
                        .single-team-qianzhan{
                            margin 24px 0 0 35px
                            width: 70px
                            height: 26px
                            line-height:24px
                            border: 1px solid #0D8DFC;
                            border-radius: 20px;
                            font-size: 13px;
                            color: #0D8DFC;
                            text-align: center;
                        }
                        .single-team-line{
                            position: absolute
                            top: 17px
                            left 0
                            height 36px
                            width: 1px
                            background: #F0F1F2;
                        }
                    }
                }

            }
            .bet-single-vote{
                .single-vote-top{
                    margin:12px 20px 0 24px
                    .single-vote-top-title{
                        font-size: 14px;
                        color: #2D2F33;
                        font-weight:bold
                    }
                    .single-vote-top-desc{
                        .single-vote-num{
                            display: inline-block
                            vertical-align middle
                            font-size: 12px;
                            color: #A8ABB3;
                        }
                        /*
                        .single-vote-see{
                            margin-left 5px
                            cursor: pointer
                            display: inline-block
                            vertical-align middle
                            font-size: 12px;
                            color: #A8ABB3;
                            height 16px
                            width 16px
                            background url("/images/index/Bet_16_Detail.svg") no-repeat;
                            background-size 100% 100%
                        }*/
                    }
                }
                .single-vote-list{
                    margin 8px 20px 0
                    padding-bottom 2px
                    .single-vote-list-items{
                        width:100%
                        height:34px
                        background: #FFFFFF;
                        border: 1px solid #EBEBED;
                        border-radius: 24px;
                        margin-bottom 10px
                        position relative
                        .icon-select{
                            display: none
                            position: absolute
                            height 16px
                            width: 16px
                            top: 8px
                            left:14px
                        }
                        .vote-items-left{
                            margin-left 18px
                            line-height 32px
                            font-size: 14px;
                            color: #2D2F33;
                        }
                        .vote-items-right{
                            position: absolute;
                            top: -1rpx;
                            right: -1rpx;
                            width: 108px;
                            font-size: 14px;
                            color: #656973;
                            height: 34px;
                            line-height: 34px;
                            text-align: center;
                            /*background: url(/images/bet_v4/Bet_white@2x.png);*/
                            /*background-repeat no-repeat;*/
                            /*background-size: 100% 100%;*/
                            /*background-position center*/
                            img {
                                width 100%
                                height 100%
                                display block
                                position absolute
                            }
                            .odds {
                                display block
                                height 100%
                                position absolute
                                left 44rpx
                                z-index 2
                            }
                        }
                    }
                    .single-vote-list-items1{
                        .icon-select{
                            display: block
                        }
                        .vote-items-left{
                            margin-left 36px
                        }
                    }
                    .single-vote-list-items2{
                        background: #0D8DFC;
                        border: 1px solid rgba(0,0,0,0.04);
                        border-radius: 24px;
                        .vote-items-left{
                            margin-left 36px
                            line-height 32px
                            font-size: 14px;
                            color: #fff;
                        }
                        .vote-items-right{
                            position: absolute;
                            top: -1rpx;
                            right: -1rpx;
                            width: 108px;
                            font-size: 14px;
                            color: #fff;
                            height: 34px;
                            line-height: 34px;
                            text-align: center;
                            /*background: url("/static/images/bet/Bet_blue@2x.png") no-repeat;*/
                            /*background-size: 100% 100%;*/
                        }
                    }
                    .single-vote-list-items:nth-child(2n){
                        float:left
                    }
                    .single-vote-list-items:nth-child(2n+1){
                        float:left
                    }
                }
            }
        }
        /*转发帖子样式*/
        .forward-post-wrap {
            margin-top:10px
            .forward-post {
                background: #FAFAFA;
                .img-wrap {
                    width: 120px
                    height: 120px
                    float left
                    .f-img {
                        width: 100%
                        border-radius: 4px 0 0 4px;
                    }
                }
                .post-conent {
                    width: 58%;
                    height: 120px
                    background: #FAFAFA;
                    float left
                    margin-left 4px
                    padding 8px 12px
                    h2 {
                        font-size: 16px;
                        color: #656973;
                        text-overflow ellipsis
                        overflow hidden
                        white-space nowrap
                    }
                    p {
                        color: #A8ABB3;
                        height: 44px
                        line-height: 22px;
                        margin 8px 0 15px
                        overflow hidden
                        font-size 14px
                    }
                    .author {
                        white-space nowrap
                        text-overflow ellipsis
                        overflow hidden
                        align-items center
                        img {
                            width: 18px
                            height: 18px
                            border-radius 50%
                        }
                        span {
                            font-size: 12px;
                            color: #656973;
                            margin-left 5px
                        }
                    }
                }
            }

        }

        /*赛事样式*/
        .forward-match-wrap {
            margin-top:10px
            .list-items-match{
                width: 100%
                height:110px
                background: #FFFFFF;
                border: 1px solid #F0F1F2;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.03);
                border-radius: 6px;
                .items-match-top{
                    width:90%
                    margin: 10px auto 0
                    text-align: center
                    font-size: 12px;
                    color: #A8ABB3;
                    background: #F7F8FA;
                    border-radius: 8px;
                    height: 22px
                    line-height: 22px
                }
                .items-match-middle{
                    text-align: center
                    margin-top: 9px
                    .items-match-left{
                        margin-left: 26px
                    }
                    .items-match-right{
                        margin-right: 26px
                    }
                    .items-match-left,.items-match-right{
                        .match-left-img{
                            border-radius:50%
                            height: 40px
                            width: 40px
                        }
                        .match-left-name{
                            font-size: 14px;
                            color: #2D2F33;
                            line-height: 17px
                            text-align: center
                        }
                    }
                    .items-match-cont{
                        display: inline-block
                        .tems-match-cont-vs{
                            margin-top: 5px
                            display:inline-block
                            height: 30px
                            width: 30px
                            text-align: center
                            line-height: 30px
                            background: #F0F1F2;
                            border-radius:50%
                            font-size: 13px;
                            color: #656973;
                            margin-bottom: 6px
                        }
                        .items-match-cont-score{
                            margin-top: 8px
                            font-size: 18px;
                            color: #2D2F33;
                            margin-bottom: 12px
                        }
                        .items-match-cont-time{
                            font-size: 12px;
                            color: #A8ABB3;
                        }
                    }
                }
            }
        }

    }
    .video-wrap {
        width 100%
        background #fff
        padding 10rpx 0
        .video {
            width: 100%
            display block
        }
        .v-img {
            width 100%
            height 400rpx
            background-color #010101
            position relative
            background-position center
            background-repeat no-repeat
            background-size cover
            img {
                display block
                width: 80rpx
                height 80rpx
                position absolute
                top calc(50% - 40rpx)
                left calc(50% - 40rpx)
            }
        }
    }
    .reward {
        padding 0 28rpx
        background-color #fff
        .reward-title {
            width 220rpx
            height 44rpx
            background #FFEFD6
            border-radius 22rpx
            padding-left 26rpx
            font-size 22rpx
            color #FFA621
            font-weight 500
            img {
                width 24rpx
                height 24rpx
                margin-right 8rpx
                margin-top 10rpx
                float left
            }
            span {
                display block
                float left
                height 44rpx
                line-height 44rpx
            }
        }
        .list {
            padding 26rpx 0
            .item {
                display -webkit-flex
                display flex
                justify-content space-between
                height 64rpx
                line-height 62rpx
                font-size 22rpx
                color #A8ABB3
                border-bottom 2rpx solid #F0F1F2
                img {
                    width 32rpx
                    height 32rpx
                    display inline-block
                    vertical-align middle
                }
                .left {
                    span {
                        display inline-block
                        vertical-align middle
                        height 100%
                        line-height 60rpx
                    }
                }
                .right {
                    max-width 40%
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
                }
            }
        }
    }

    .tools-bar {
        display -webkit-flex
        display flex
        justify-content space-between
        align-items center
        height 88rpx
        font-size 22rpx
        color #656973
        padding 0 64rpx
        background-color #fff
        .btn {
            display -webkit-flex
            display flex
            align-items center
            .iconfont {
                font-size 38rpx
                color #656973
            }
            &.share-btn {
                padding 0
                margin 0
                background transparent
                border none
                &:after {
                    border none
                }
            }
            &.praise {
                .iconfont {
                    color #0D8DFC
                }
            }
        }
        .btn-icon {
            width 48rpx
            height 48rpx
        }
        .num {
            margin-left 8rpx
        }
    }

    .comment-wrap {
        margin-top 20rpx
        background #fff

        .c-header {
            height 66rpx
            padding 0 20rpx 0 28rpx
            box-shadow: 0 0 0 2rpx #F0F1F2
            .line {
                width: 8rpx
                height: 24rpx
                background: #0D8DFC
                float left
                margin-top 22rpx
            }
            .title {
                height 66rpx
                line-height 66rpx
                float left
                font-size 28rpx
                color #2D2F33
                font-weight 600
                margin-left 14rpx
                font-family: 'PingFangSC-Regular', 'Microsoft Yahei', sans-serif;
            }
            .right {
                height 66rpx
                line-height 66rpx
                float right
                color #A8ABB3
                font-size 28rpx
                font-weight 400
                font-family: 'PingFangSC-Regular', 'Microsoft Yahei', sans-serif;
                .count {
                    padding 0 14rpx
                }
                .icon-general__arrow_right {
                    font-size 28rpx
                    margin-left 6rpx
                }
                .sort-img {
                    width 24rpx
                    height 24rpx
                    margin-left 8rpx
                    &.desc {
                        -webkit-transform rotate(180deg)
                    }
                }
            }
        }
        .c-list {
            .null {
                padding 60rpx 0
                img {
                    display block
                    width 30%
                    margin 0 auto
                }
                .text {
                    width 100%
                    font-size 24rpx
                    color #A8ABB3
                    text-align center
                    margin-top 20rpx
                }
            }
        }
        .c-item {
            padding 24rpx 28rpx 18rpx
            +.c-item {
                border-top 2rpx solid #F0F1F2
            }

            .avatar {
                width 34px
                height 34px
                position relative
                float left
                .avatar-img {
                    width: 100%
                    height: 100%
                    border-radius 50%
                    display block
                }
                .sign-icon {
                    width 30rpx
                    height 30rpx
                    position absolute
                    right -2rpx
                    bottom -2rpx
                }
            }
            .comment-info {
                margin-left 40px
                .c-username {
                    display -webkit-flex
                    display flex
                    align-items center
                    margin-left 4px
                    span {
                        display block
                        height 21px
                        line-height 21px
                        font-size 15px
                        font-weight 600
                        font-family 'PingFangSC-Semibold', 'Microsoft Yahei', sans-serif
                    }
                }
                .rank {
                    width 68rpx
                    height 28rpx
                    line-height 28rpx
                    background linear-gradient(135deg,rgba(25,167,255,1) 0%,rgba(5,138,255,1) 100%)
                    border-radius 6rpx
                    text-align center
                    font-size 22rpx
                    color #fff
                    margin-left 12rpx
                }
                .content {
                    width 100%
                    margin-left 4px
                    .text-box {
                        width 100%
                        font-size 20px
                        font-weight 400
                        line-height 52rpx
                        text-align justify
                        word-break break-all
                    }
                    .img-box {
                        justify-content space-between
                        margin-top 20rpx
                        .pic-wrap {
                            position relative
                            .type-label {
                                width 64rpx
                                height 36rpx
                                line-height 36rpx
                                text-align center
                                color #fff
                                font-size 22rpx
                                position absolute
                                right 0
                                bottom 0
                                border-radius 6rpx 0 0 0
                                &.gif {
                                    background #0D8DFC
                                }
                                &.lang {
                                    background #16DE9B
                                }
                            }
                        }
                        img {
                            display block
                        }
                        &.one {
                            .pic-wrap {
                                width 100%
                                img {
                                    width 100%
                                }
                            }
                        }
                        &.two {
                            .pic-wrap {
                                width 49.4%
                                img {
                                    width 100%
                                }
                            }
                        }
                        &.three {
                            .pic-wrap {
                                width 32.5%
                                img {
                                    width 100%
                                }
                            }
                        }
                    }
                }
                .tools-bar {
                    padding 0 6rpx
                    margin-top 14rpx
                    height: auto
                    display -webkit-flex
                    display flex
                    justify-content space-between
                    align-items center
                    .left {
                        color #A8ABB3
                        font-size 24rpx
                        .date {
                            margin-left 20rpx
                        }
                    }
                    .right {
                        display -webkit-flex
                        display flex
                        justify-content flex-end
                        align-items center
                        .btn {
                            height 48rpx
                            &.like-btn {
                                width 48rpx
                                position relative
                                margin-right 6rpx
                                display block
                                line-height 48rpx
                                .num {
                                    position absolute
                                    bottom 0
                                    right 0
                                    display block
                                    height 20rpx
                                    padding 0 6rpx
                                    background #0D8DFC
                                    border-radius 10rpx
                                    line-height 20rpx
                                    color #fff
                                    font-size 16rpx
                                }
                            }
                            &.share-btn, &.comment-btn {
                                margin-right 20rpx
                            }
                        }
                    }
                }
                .reply-list {
                    border-radius 16rpx 16rpx 0 0
                    background-color #F7F8FA
                    padding 16rpx 28rpx
                    margin-top 8px
                    &.full {
                        border-radius 16rpx
                    }

                    .r-item {
                        /*line-height 48rpx*/
                        font-size 28rpx
                        font-weight 500
                        color #656973
                        +.r-item {
                            margin-top 16rpx
                        }
                        .r-username {
                            color #4B9CE3
                            margin-right 10rpx
                        }
                        .r-date {
                            margin-left 20rpx
                            font-size 24rpx
                            color #A8ABB3
                            font-weight 400
                        }
                    }
                }
                .more-hot-reply-btn {
                    width 100%
                    height 56rpx
                    border-radius 0 0 16rpx 16rpx
                    background #f2f3f5
                    line-height 56rpx
                    text-align center
                    font-size 22rpx
                    font-weight 600
                    color #A8ABB3
                }
            }
        }
        .more {
            width: 100%
            height: 80rpx
            line-height 80rpx
            text-align center
            font-size 26rpx
            color #A8ABB3
            background-color rgba(0,0,0, .1)
        }
        &.hots {
           .c-header {
               background #E0CB9D
               box-shadow: 0 0 0 2rpx #D9BF93
               .line {
                   background #fff
               }
               .title {
                   color #fff
               }
               .right {
                   color #fff
               }
           }
            .c-item {
                background #FFFCF7
                .comment-info {
                    .content {
                        color #333
                    }
                    .tools-bar {
                        background #FFFCF7
                        .left {
                            color #B3B3B3
                        }
                    }
                    .reply-list {
                        background-color #FFF7E8
                        box-shadow 0 0 0 2rpx #FAE8C3
                        .r-item {
                            color #737373
                            .r-username {
                                color #DBB676
                                margin-right 10rpx
                            }
                            .r-date {
                                color #B3B3B3
                            }
                        }
                    }
                    .more-hot-reply-btn {
                        background #fff5e0
                        box-shadow 0 0 0 2rpx #FAE8C3
                        color #DBB676
                    }
                }
            }
        }
    }
    .comment-send-wrap {
        position fixed
        bottom 0
        width 100%
        height 186rpx
        background #fff
        border-top 1rpx solid #F0F1F2
        padding-top 20rpx
        background #fff
        .ipt {
            display block
            width 86%
            height 72rpx
            margin 0 auto
            background #F7F8FA
            border-radius 36rpx
            line-height 72rpx
            color #656973
            font-size 32rpx
            font-weight 400
            padding-left 36rpx
        }
        .btn-wrap {
            display -webkit-flex
            display flex
            justify-content space-between
            align-items center
            margin-top 20rpx
            padding 0 10rpx
            .btn {
                width 120rpx
                height 60rpx
                line-height 60rpx
                text-align center
                font-size 28rpx
                color #656973
                border none
                outline none
                background-color #fff
                margin 0
                &:after {
                    border none
                }
            }
        }
    }
</style>
