(function() {
    console.log("this works");
    Vue.component("first-component", {
        //child
        template: "#template",
        props: ["postTitle", "id"],
        data: function() {
            return {
                name: "Dganit",
                count: 0
            };
        },
        mounted: function() {
            console.log("component mounted: ");
            console.log("my postTitle: ", this.postTitle);
            console.log("id: ", this.id);
        },
        methods: {
            close: function() {
                console.log("samity check click worked!");
                this.$emit("close");
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            selectedFruit: null,
            selectedImage: null,
            heading: "Welcome to my image board!",
            latest: "Latest images",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            fruits: [
                {
                    title: "🥝",
                    id: 1
                },
                {
                    title: "🍓",
                    id: 2
                },
                {
                    title: "🍋",
                    id: 3
                }
            ]
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            var vueInstance = this;
            axios
                .get("/candy")
                .then(function(res) {
                    vueInstance.images = res.data;
                })
                .catch(function(err) {
                    console.log("error in axios get candy: ", err);
                });
        },

        methods: {
            closeMe: function() {
                console.log("i need to close the modal!!!");
                this.selectedFruit = null;
            },
            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ", this, "33");
                //we use FormData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                // console.log('formData: ', formData);

                axios
                    .post("upload", formData)
                    .then(function(resp) {
                        // resp.data.rows[0] image object. we want to unshift this into the vueInstance array. remember "this" will be lost. look in get how that was solved.
                        console.log("resp form POST /upload: ", resp);
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },
            handleChange: function(e) {
                console.log("handleChange is running");
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
    });
})();
