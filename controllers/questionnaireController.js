/*
 * Copyright (c) 2016 ROMSOFT.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the The MIT License (MIT).
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *    RAFAEL MASTALERU (ROMSOFT)
 * Initially developed in the context of OPERANDO EU project www.operando.eu
 */


angular.module('operando').controller('QuestionnaireController', function ($scope) {

    $scope.schema = {
        type: "object",
        properties: {
            audience: {
                title: "Do you prefer your social network posts and timelines to reach the widest possible audience?",
                type: "string",
                enum: ["Yes", "No, prefer to restrict to friends"]
            },
            personalized_ads: {
                title: "Do you like personalized ads?",
                type: "string",
                enum: ["Yes", "No"]
            },
            phone_email_share: {
                title: "Is it OK with you that your phone number and email address can be used to find and contact you on the social networks?",
                type: "string",
                enum: ["Yes", "No"]
            },
            privacy: {
                title: "What is more important  – privacy or ease of use?",
                type: "string",
                enum: ["Privacy", "Easy of use"]
            },

            freebies: {
                title: "What is more important – privacy or freebies that you can get on the Web?",
                type: "string",
                enum: ["Privacy", "Freebies"]
            },
            experience: {
                title: "What is more important – privacy or personalization of your web experience?",
                type: "string",
                enum: ["Privacy", "Web Experience"]
            },
            share: {
                title: "Do you like sharing everything with friends?",
                type: "string",
                enum: ["Yes", "No"]
            },
            friends_share: {
                title: "Do you enjoy it when friends share your posts with their friends?",
                type: "string",
                enum: ["Yes", "No"]
            },
            game_experience: {
                title: "Do you like to share your online game experience with friends?",
                type: "string",
                enum: ["Yes", "No"]
            },
            cv_share: {
                title: "Do you like your CV to be exposed to as many people as possible, or do you prefer to limit it as much as possible?",
                type: "string",
                enum: ["Expose it", "Limit it"]
            }
        }

};


    for (var key in $scope.schema.properties) {
        $scope.schema.properties[key].required = true;
    }


    $scope.form = [];
    for (var key in $scope.schema.properties) {
        $scope.form.push({
            key: key,
            type: "radios"
        })
    }


    $scope.form.push({
        type: "submit",
        title: "Optimise your settings"
    });


    $scope.submitQuestionnaire = function() {
        console.log("questionnaire submitted");
        console.log($scope.model);

        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if ($scope.questionnaireform.$valid) {
            increaseFacebookPrivacy();
        }
    }


    $scope.model = {};
});
