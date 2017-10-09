history-graph {
    position: relative;
    display: block;
    padding-left: $item-ios-padding-left;
    padding-right: $item-ios-padding-right;
    .datePicker {
        padding-bottom: 15px;
        ul {
            display: flex;
            justify-content: space-around;
            padding-left: 0;
            margin: 10px auto 7px;
            li {
                width: 55px;
                padding: 3px 0;
                border-radius: 2px;
                position: relative;
                list-style: none;
                color: #9b9b9b;
                text-align: center;
                &.active {
                    background-color: #2b2d35;
                    opacity: 1;
                }
                font-size: 1.2rem;
            }
        }
    }
    .container {
        .performance-line {
            stroke: #28BBE8;
            stroke-width: 1.1px;
            fill: none;
        }
        .index-line {
            stroke: #23354A;
            stroke-width: 1px;
            fill: none;
        }
        #hist-graph-gradient {
            .top-stop {
                stop-color: #67D1F2;
            }
            .bottom-stop {
                stop-color: #191A1B;
            }
        }
        #index-hist-graph-gradient {
            .top-stop {
                stop-color: #2387F3;
                stop-opacity: 0.824926404;
            }
            .bottom-stop {
                stop-color: #1580F3;
                stop-opacity: 0.276777627;
            }
        }
        .performance-area,
        .index-area {
            opacity: 0.2;
        }
        .axis-g {
            path {
                display: none;
            }
            text {
                fill: $m-gray;
                font-size: 1rem;
                @include ra-font-regular();
            }
            line {
                stroke: #1b1c1f;
                stroke-width: 1px;
            }
        }
        .y-axis-g {
            text-anchor: end;
        }
        .x-axis-g {
            .tick {
                &:nth-child(2) {
                    text {
                        text-anchor: start;
                    }
                }
                &:nth-child(3) {
                    text {
                        text-anchor: center;
                    }
                }
                &:nth-child(4) {
                    text {
                        text-anchor: end;
                    }
                }
            }
        }
        .legend {
            text {
                fill: $m-gray;
                font-size: 10px;
            }
        }
    }
}