invest-portfolio-page {
    .invest-introduction {
        margin-top: 25px;
        padding: 0 $item-ios-padding-left;
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

    .invest-solution {

        .introduction {
            padding-left: 15px;
            font-size: 1.75rem;
            color: $m-gray;
        }

        donut {
            display: inline-block;
            width: 100%;
            height: 224px;
            text-align: center;
            margin: 10px 0;
        }

        .head {
            background-color: $background-third-color;
        }

        .sign {
            display: inline-block;
            position: relative;
            width: 5%;
        }

        .name {
            display: inline-block;
            width: 40%;
        }

        .percent {
            display: inline-block;
            width: 55%;
        }
    }

}