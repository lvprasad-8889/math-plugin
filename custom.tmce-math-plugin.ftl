<#attempt>
<#assign version = "458">
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.css"
        integrity="sha384-NFTC4wvyQKLwuJ8Ez9AvPNBv8zcC2XaQzXSMvtORKw28BdJbB2QE8Ka+OyrIHcQJ"
        crossorigin="anonymous"
    />

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    <#assign mathPluginAsset = "/html/assets/mathplugin" + version + ".css" />
    <link href="${asset.get(mathPluginAsset)}" rel="stylesheet" />
    <#assign mathPlugin = "false" />
    <#if !user.anonymous>
      <#assign mathPlugin= "true" />
     <#-- 
      <#assign selfRoles = restadmin("/users/self/roles").roles.role />
      <#list selfRoles as selfRole>
         <#if selfRole.name == "Math Plugin User" >
         <#assign mathPlugin= "true" />
            <#break>
          </#if>
       </#list>
      -->
    </#if>

    <#assign render = ["tkb", "blog", "forum"] />
        <#assign isRoleExist = false />
        <#if render?seq_contains(page.interactionStyle)>
            <#assign isRoleExist = true />
    </#if>

    <#if mathPlugin == "true">  
            <script>
                 document.body.classList.add("math-plugin-user");
            </script>
    </#if>

    <#if isRoleExist>  
            <script
                defer
                src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.js"
                integrity="sha384-z9arB7KJHppq8kK9AESncXcQd/KXIMMPiCrAdxfFpp+5QU438lgBE7UFGbk+gljP"
                crossorigin="anonymous"
            ></script>
            <script
                defer
                src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
                integrity="sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk"
                crossorigin="anonymous"
                onload="renderMathInElement(document.body);"
            ></script>

            <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"
            >
            </script>
            <#assign mathPluginScript = "/html/assets/mathplugin" + version + ".js" />
            <script src="${asset.get(mathPluginScript)}"></script>
    </#if>
<#recover>
</#attempt>

