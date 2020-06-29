<template>
    <el-container class="layout">
        <el-header class="layout-header" v-if="$route.path.indexOf('/user') === -1">
            <transition name="logo" v-if="!isCollapse">
                <div class="header-logo">
                    <div class="title">
                        百井居
                    </div>
                </div>
            </transition>

            <a class="header-btn" @click="toggleMenu"><i
                    :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i></a>

            <div class="header-right">
                <a class="header-btn fl">
                    <i class="iconfont el-icon-user-solid"></i>
                    <span>{{ userInfo.employName }}</span>
                </a>
                <a class="header-btn fl" @click="logout"><i class="iconfont icon-off"></i></a>
                <span class="mr20 fl"></span>
            </div>
        </el-header>

        <el-container v-if="$route.path.indexOf('/user') === -1">
            <el-aside class="layout-aside" width="">
                <el-menu class="side-menu" :default-active="activdMenu" :collapse="isCollapse"
                         @select="selectMenuHandler">
                    <menu-item v-for="item in menuData" :data="item" :key="item.menuCode"></menu-item>
                </el-menu>
            </el-aside>

            <el-main class="layout-main">
                <router-view></router-view>
            </el-main>
        </el-container>

        <el-container v-else>
            <router-view></router-view>
        </el-container>
    </el-container>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import MenuItem from '@/components/MenuItem'
    import menu from './assets/json/menu'

    export default {
        name: 'App',

        components: {
            MenuItem
        },

        computed: {
            ...mapState('user', {
                userInfo: state => state.userInfo || {}
            }),

            menuData() {
                if (this.userInfo.storeRole === 'SUPERADMIN') {
                    return [menu.employ, menu.dishes, menu.order]
                }
                if (this.userInfo.storeRole === 'ADMIN') {
                    return [menu.dishes, menu.order]
                }
                return []
            }
        },

        data() {
            return {
                isCollapse: false,
                activdMenu: ''
            }
        },

        watch: {
            $route(to) {
                if (to.meta.menuIndex) {
                    this.activdMenu = to.meta.menuIndex
                } else {
                    this.activdMenu = to.name
                }
            }
        },

        created() {
            this.getUserInfoX()
            console.dir(this.userInfo)
        },

        methods: {
            ...mapActions('user', ['getUserInfoX']),

            toggleMenu() {
                this.isCollapse = !this.isCollapse
            },

            selectMenuHandler(index) {
                let name = index
                this.$router.push({name: name})
            },

            logout() {
                this.$router.replace('/user/login')
            }
        }
    }
</script>

<style lang="scss">
    .layout {
        height: 100vh;

        .layout-header {
            background-color: white;
            color: white;
            line-height: 60px;
            padding: 0;

            .header-logo {
                float: left;
                width: 250px;
                overflow: hidden;
            }

            .title {
                display: block;
                text-align: center;
                width: 250px;
                font-size: 18px;
                color: $neut2;
                font-weight: bold;
            }

            .logo-enter-active, .logo-leave-active {
                transition: width .5s ease-in;
            }

            .logo-enter, .logo-leave-to {
                transition: width .5s ease-out;
                width: 0;
            }

            .header-btn {
                display: inline-block;
                padding: 0 20px;
                height: 60px;
                line-height: 60px;
                color: $neut2;

                &:hover {
                    color: $primary;
                }

                i {
                    font-size: 20px;
                    line-height: 60px;
                    position: relative;
                    top: 2px;
                }

                span {
                    margin-left: 3px;
                }
            }

            .header-right {
                float: right;
            }
        }

        .layout-aside {
            background-color: white;

            .el-menu--collapse {
                width: 64px;
            }

            .el-menu {
                background-color: transparent;
                border-right: none;

                .el-menu-item, .el-submenu__title {
                    color: $neut2;

                    i {
                        color: $neut2;
                    }

                    &.is-active {
                        background-color: $primary;
                        color: $neut4;

                        i {
                            color: $neut4;
                        }
                    }

                    &:hover {
                        background-color: $primary;
                        color: $neut4;

                        i {
                            color: $neut4;
                        }
                    }
                }
            }
        }

        .side-menu:not(.el-menu--collapse) {
            width: 250px;
            min-height: 400px;
        }

        .layout-main {
            position: relative;
            padding: 15px;
            background-color: $neut4;
            min-width: 1400px;
        }
    }
</style>
