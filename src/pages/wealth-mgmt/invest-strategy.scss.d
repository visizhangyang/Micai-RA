invest-strategy-page {
    .section-info {
        display: none;
        background-color: $background-secondary-color;
        color: #6D6B80;
        margin-top: 20px;
        padding: 15px 30px;

        .risk {
            color:#00A6FE;
        }
    }

    .section-risk-result {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        
        .result-wrapper {
            .risk-number {
                width: 18.75rem;
                height: 14.25rem;
                background-color: #1e1e27;
                border: 2px solid #2B2B38;
                border-radius: 2rem;
                display: flex;
                justify-content: center;
                align-items:center;
                font-size: 9rem;
            }

            .split-line {
                margin: 25px 0;
                background-image: linear-gradient(90deg, #0291FF 0%, #47DD6B 34%, #FFA500 67%, #FA5333 100%);
                border-radius: 5px;
                height: 5px;
                .split-line-dash {
                    background: linear-gradient(90deg, 
                        transparent 9%, black 9%, black 10%, transparent 10%, 
                        transparent 19%, black 19%, black 20%, transparent 20%,
                        transparent 29%, black 29%, black 30%, transparent 30%,
                        transparent 39%, black 39%, black 40%, transparent 40%,
                        transparent 49%, black 49%, black 50%, transparent 50%,
                        transparent 59%, black 59%, black 60%, transparent 60%,
                        transparent 69%, black 69%, black 70%, transparent 70%,
                        transparent 79%, black 79%, black 80%, transparent 80%,
                        transparent 89%, black 89%, black 90%, transparent 90%
                    );
                    height: 5px;
                }
            }

            .risk-text {
                text-align: center;
                font-size: 3.375rem;
                line-height: 100%;
            }
        }
    }

    .risk-adjust {
        background-color: $background-third-color;
        margin-top: 20px;
        padding: 15px 0 15px;

        ion-label {
            color: $m-gray;
            font-size: 1.5rem;
            position: relative;
            top: 25px;

            &[range-left] {
                left: 23px;
            }

            &[range-right] {
                right: 28px;
            }
        }

        .range-slider {
            .range-tick {
                background-color: $m-gray;
            }

            .range-bar {
                margin-left: -2px;
                height: 5px;
                width: calc(100% + 3px);
                border-radius: 5px;
                background-image: linear-gradient(90deg, #0291FF 0%, #47DD6B 34%, #FFA500 67%, #FA5333 100%);

                .range-bar-active {
                    display: none;
                }
            }
        }

    }

    .yearly-rate {
        margin-top: 25px;
        display: flex;

        .rate-header {
            margin-top: 10px;
            text-align: center;
        }

        .rate-value {
            margin: 10px 0;
            text-align: center;
            color: #1580F3;
            font-size: 2.5rem;
        }

        .return-rate {
            background-color: $background-third-color;
            border-radius: 0 5px 5px 0;
            border-right: 2px solid $background-color;
            flex: 1;
        }

        .volatility-rate {
            background-color: $background-third-color;
            border-radius: 5px 0 0 5px;
            border-left: 2px solid $background-color;
            flex: 1;
        }
    }
    
}